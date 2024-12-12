import { z } from 'zod';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import FashionModuleService from '../../../../../modules/fashion/service';
import { FASHION_MODULE } from '../../../../../modules/fashion';

const colorsListQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  deleted: z.coerce.boolean().optional().default(false),
});

const colorsCreateBodySchema = z.object({
  name: z.string().min(1, "Color name is required"),
  hex_code: z.string()
    .length(7, "Hex code must be exactly 7 characters long")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex code format - must start with # followed by 6 hex digits"),
});

const paramsSchema = z.object({
  id: z.string().min(1, "Material ID is required"),
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Validate query parameters and URL params
    const { page, deleted } = colorsListQuerySchema.parse(req.query);
    const { id } = paramsSchema.parse(req.params);

    const fashionModuleService: FashionModuleService =
      req.scope.resolve(FASHION_MODULE);

    const [colors, count] = await fashionModuleService.listAndCountColors(
      deleted
        ? {
            deleted_at: { $lte: new Date() },
            material_id: id,
          }
        : {
            material_id: id,
          },
      {
        skip: 20 * (page - 1),
        take: 20,
        withDeleted: deleted,
      },
    );

    const last_page = Math.ceil(count / 20);

    res.status(200).json({ 
      colors, 
      count, 
      page, 
      last_page,
      page_size: 20
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid request parameters',
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
    // Handle string body if needed
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

    // Validate both body and params
    const { id } = paramsSchema.parse(req.params);
    const validatedBody = colorsCreateBodySchema.parse(req.body);

    const fashionModuleService: FashionModuleService =
      req.scope.resolve(FASHION_MODULE);

    const color = await fashionModuleService.createColors({
      ...validatedBody,
      material_id: id,
    });

    // Use 201 for creation
    res.status(201).json({
      message: 'Color created successfully',
      color
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: error.errors
      });
    }

    // Handle potential database/service errors
    if (error instanceof Error && error.message.includes('material_id')) {
      return res.status(404).json({
        message: 'Material not found',
        error: error.message
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};



// import { z } from 'zod';
// import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
// import FashionModuleService from '../../../../../modules/fashion/service';
// import { FASHION_MODULE } from '../../../../../modules/fashion';

// const colorsListQuerySchema = z.object({
//   page: z.coerce.number().min(1).optional().default(1),
//   deleted: z.coerce.boolean().optional().default(false),
// });

// export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
//   const { page, deleted } = colorsListQuerySchema.parse(req.query);

//   const fashionModuleService: FashionModuleService =
//     req.scope.resolve(FASHION_MODULE);

//   const [colors, count] = await fashionModuleService.listAndCountColors(
//     deleted
//       ? {
//           deleted_at: { $lte: new Date() },
//           material_id: req.params.id,
//         }
//       : {
//           material_id: req.params.id,
//         },
//     {
//       skip: 20 * (page - 1),
//       take: 20,
//       withDeleted: deleted,
//     },
//   );

//   const last_page = Math.ceil(count / 20);

//   res.status(200).json({ colors, count, page, last_page });
// };

// const colorsCreateBodySchema = z.object({
//   name: z.string().min(1),
//   hex_code: z.string().min(7).max(7),
// });

// export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
//   const fashionModuleService: FashionModuleService =
//     req.scope.resolve(FASHION_MODULE);

//   const color = await fashionModuleService.createColors({
//     ...colorsCreateBodySchema.parse(req.body),
//     material_id: req.params.id,
//   });

//   res.status(200).json(color);
// };
