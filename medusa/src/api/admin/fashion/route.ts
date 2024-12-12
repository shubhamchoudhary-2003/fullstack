import { z } from 'zod';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import FashionModuleService from '../../../modules/fashion/service';
import { FASHION_MODULE } from '../../../modules/fashion';

const materialsListQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  deleted: z.coerce.boolean().optional().default(false),
});

const createMaterialBodySchema = z.object({
  name: z.string().min(1),
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { page, deleted } = materialsListQuerySchema.parse(req.query);

    const fashionModuleService: FashionModuleService =
      req.scope.resolve(FASHION_MODULE);

    const [materials, count] = await fashionModuleService.listAndCountMaterials(
      deleted
        ? {
            deleted_at: { $lte: new Date() },
          }
        : undefined,
      {
        skip: 20 * (page - 1),
        take: 20,
        withDeleted: deleted,
        relations: ['colors'],
      },
    );

    const last_page = Math.ceil(count / 20);

    res.status(200).json({ materials, count, page, last_page });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid query parameters',
        errors: error.errors 
      });
    }
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Ensure req.body is an object
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        return res.status(400).json({
          message: 'Invalid request body - expected JSON object',
          error: 'Parse error'
        });
      }
    }

    const validatedBody = createMaterialBodySchema.parse(req.body);
    
    const fashionModuleService: FashionModuleService =
      req.scope.resolve(FASHION_MODULE);

    const material = await fashionModuleService.createMaterials(validatedBody);

    res.status(201).json(material);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid request body',
        errors: error.errors 
      });
    }
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};