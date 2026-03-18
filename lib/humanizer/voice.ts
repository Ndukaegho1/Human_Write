import { getCollection } from "@/lib/db"
import { WritingSampleDoc } from "@/models/collections"
import { computeSignals } from "@/lib/scoring/signals"

export async function getVoiceProfile(firebaseUid: string) {
  return (await getCollection("voice_profiles")).findOne({ firebase_uid: firebaseUid })
}

export async function getRecentSamples(firebaseUid: string) {
  return (
    await getCollection<WritingSampleDoc>("writing_samples")
  ).find({ firebase_uid: firebaseUid })
    .sort({ created_at: -1 })
    .limit(5)
    .toArray()
}

export async function pickRelevantSamples(firebaseUid: string, inputText: string) {
  const samples = await getRecentSamples(firebaseUid)
  // TODO: replace this heuristic with embedding + similarity retrieval (Atlas vector index) once embeddings are stored.
  const score = samples.map((sample) => ({
    sample,
    score: computeSignals(sample.content).vocab_diversity,
  }))
  return score
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.sample)
}
