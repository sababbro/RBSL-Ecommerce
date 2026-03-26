import { seedMeximcoWorkflow } from "../workflows/seed-meximco"

export default async function seedProducts({ container }: { container: any }) {
  console.log("Starting forced catalog injection...")
  const { result } = await seedMeximcoWorkflow(container).run()
  console.log("Injection complete. Products created:", result?.length)
}
