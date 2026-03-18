import OpenAI from "openai"
import { HumanizerMode, RewriteStrength } from "@/models/collections"
import { env } from "@/lib/env"

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null

function cleanText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim()
}

function capitalizeSentenceStarts(text: string) {
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`)
}

function replaceWholeWord(text: string, from: string, to: string) {
  return text.replace(new RegExp(`\\b${from}\\b`, "gi"), (match) =>
    match[0] === match[0].toUpperCase() ? to[0].toUpperCase() + to.slice(1) : to
  )
}

function applyPlainEnglish(text: string) {
  const replacements: Array<[string, string]> = [
    ["utilize", "use"],
    ["leverage", "use"],
    ["individuals", "people"],
    ["numerous", "many"],
    ["approximately", "about"],
    ["in order to", "to"],
    ["demonstrate", "show"],
    ["assist", "help"],
    ["purchase", "buy"],
    ["additional", "extra"],
    ["moreover", "also"],
    ["additionally", "also"],
    ["therefore", "so"],
  ]

  return replacements.reduce((current, [from, to]) => replaceWholeWord(current, from, to), text)
}

function makeMoreConversational(text: string) {
  return text
    .replace(/\bdo not\b/gi, "don't")
    .replace(/\bcannot\b/gi, "can't")
    .replace(/\bit is\b/gi, "it's")
    .replace(/\bthat is\b/gi, "that's")
    .replace(/\bwe are\b/gi, "we're")
}

function makeMoreFormal(text: string) {
  return text
    .replace(/\bdon't\b/gi, "do not")
    .replace(/\bcan't\b/gi, "cannot")
    .replace(/\bit's\b/gi, "it is")
    .replace(/\bthat's\b/gi, "that is")
    .replace(/\bwe're\b/gi, "we are")
}

function smoothTransitions(text: string) {
  return text
    .replace(/\bhowever\b/gi, "but")
    .replace(/\bmoreover\b/gi, "also")
    .replace(/\bin addition\b/gi, "also")
    .replace(/\bfor example\b/gi, "for instance")
    .replace(/\btherefore\b/gi, "so")
}

function applyHumanPhrasing(text: string) {
  return text
    .replace(/\bgenerated\b/gi, "written")
    .replace(/\bverify\b/gi, "check")
    .replace(/\bseveral\b/gi, "a few")
    .replace(/\breturn\b/gi, "give")
    .replace(/\bpreserving\b/gi, "keeping")
    .replace(/\boriginal meaning\b/gi, "same meaning")
    .replace(/\bkeeping the language natural\b/gi, "making the language sound natural")
}

function reshapeClauses(text: string) {
  return capitalizeSentenceStarts(
    text
      .replace(/\s+while\s+preserving\s+/i, ". It still keeps ")
      .replace(/\s+while\s+keeping\s+/i, ". It still keeps ")
      .replace(/\s+while\s+making\s+/i, ". It still makes ")
      .replace(/\s+while\s+/i, ". At the same time, it ")
      .replace(/\band making the language sound natural\b/gi, " and sounds natural")
      .replace(/\band keeping the language natural\b/gi, " and sounds natural")
      .replace(/,\s+so\s+/i, ". So ")
  )
}

function shortenRhythm(text: string) {
  return capitalizeSentenceStarts(
    text
      .replace(/;\s+/g, ". ")
      .replace(/,\s+(which|while|and)\s+/gi, ". $1 ")
      .replace(/\s+/g, " ")
      .trim()
  )
}

export function buildLocalRewriteVariants(inputText: string, mode: HumanizerMode, strength: RewriteStrength) {
  const cleaned = cleanText(inputText)
  const plain = capitalizeSentenceStarts(applyPlainEnglish(cleaned))
  const balanced = capitalizeSentenceStarts(smoothTransitions(plain))
  const conversational = capitalizeSentenceStarts(makeMoreConversational(smoothTransitions(plain)))
  const professional = capitalizeSentenceStarts(makeMoreFormal(smoothTransitions(plain)))
  const warmer = capitalizeSentenceStarts(applyHumanPhrasing(conversational))
  const restructured = capitalizeSentenceStarts(reshapeClauses(warmer))
  const concise = shortenRhythm(applyHumanPhrasing(plain))
  const crisp = capitalizeSentenceStarts(shortenRhythm(smoothTransitions(warmer)))

  const highStrength = strength === "high"
  const mediumStrength = strength === "medium"

  const byMode =
    mode === "professional"
      ? [professional, balanced, crisp, restructured, plain, conversational]
      : mode === "concise"
        ? [crisp, concise, balanced, restructured, plain, conversational]
        : mode === "more_human"
          ? [warmer, restructured, conversational, crisp, balanced, plain, professional]
          : mode === "casual"
            ? [conversational, warmer, restructured, balanced, plain, crisp, professional]
            : [balanced, warmer, crisp, restructured, conversational, plain, professional]

  const byStrength = highStrength
    ? [byMode[0], restructured, conversational, crisp, balanced, plain, professional]
    : mediumStrength
      ? [byMode[0], restructured, balanced, conversational, crisp, plain, professional]
      : [byMode[0], restructured, plain, balanced, crisp, conversational, professional]

  const unique = [...new Set(byStrength.map((item) => cleanText(item)).filter(Boolean))]

  while (unique.length < 3) {
    unique.push(cleanText(cleaned))
  }

  return unique.slice(0, 3)
}

export async function generateRewriteVariants(params: {
  inputText: string
  mode: HumanizerMode
  strength: RewriteStrength
  systemPrompt: string
}): Promise<string[]> {
  if (!client) {
    return buildLocalRewriteVariants(params.inputText, params.mode, params.strength)
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: params.strength === "high" ? 0.8 : params.strength === "medium" ? 0.6 : 0.4,
    messages: [
      { role: "system", content: params.systemPrompt },
      {
        role: "user",
        content: `Rewrite in 3 variants, preserve meaning. Input:\n\n${params.inputText}\n\nMode=${params.mode} | Strength=${params.strength}`,
      },
    ],
    n: 3,
  })

  return (
    completion.choices
      .map((choice) => choice.message?.content?.trim())
      .filter(Boolean) as string[]
  )
}
