import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

export const productSchema = z.object({
  order_id: z.number(),
  item_id: z.number(),
  product_id: z.number(),
  variation_id: z.number(),
  business_number: z.string(),
  business_name: z.string(),
  order_status: z.string(),
  quantity: z.number(),
  subtotal: z.string(),
  subtotal_tax: z.string(),
  total:z.string(),
  total_tax: z.string(),
  taxes:z.object({
    total: z.record(z.string()),
    subtotal: z.record(z.string()),
  }),
})

export type Task = z.infer<typeof taskSchema>
