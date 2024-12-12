// import { Modules } from '@medusajs/framework/utils';
// import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
// import { z } from 'zod';

// const productTypeFieldsMetadataSchema = z.object({
//   image: z
//     .object({
//       id: z.string(),
//       url: z.string().url(),
//     })
//     .optional(),
// });

// export async function GET(
//   req: MedusaRequest,
//   res: MedusaResponse,
// ): Promise<void> {
//   const { productTypeId } = req.params;
//   const productService = req.scope.resolve(Modules.PRODUCT);
//   const productType = await productService.retrieveProductType(productTypeId);

//   const parsed = productTypeFieldsMetadataSchema.safeParse(
//     productType.metadata ?? {},
//   );

//   res.json({
//     image: parsed.success && parsed.data.image ? parsed.data.image : null,
//   });
// }

// export async function POST(
//   req: MedusaRequest,
//   res: MedusaResponse,
// ): Promise<void> {
//   const { productTypeId } = req.params;
//   const customFields = productTypeFieldsMetadataSchema.parse(req.body);

//   const productService = req.scope.resolve(Modules.PRODUCT);
//   const productType = await productService.retrieveProductType(productTypeId);

//   const updatedProductType = await productService.updateProductTypes(
//     productTypeId,
//     {
//       metadata: {
//         ...productType.metadata,
//         ...customFields,
//       },
//     },
//   );

//   res.json(updatedProductType);
// }


import { Modules } from '@medusajs/framework/utils';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { z } from 'zod';

// Schema for image object
const imageSchema = z.object({
  id: z.string().min(1, "Image ID is required"),
  url: z.string().url("Invalid URL format"),
});

// Schema for product type metadata
const productTypeFieldsMetadataSchema = z.object({
  image: imageSchema.optional(),
});

// Schema for URL parameters
const paramsSchema = z.object({
  productTypeId: z.string().min(1, "Product type ID is required"),
});

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  try {
    // Validate URL parameters
    const { productTypeId } = paramsSchema.parse(req.params);

    const productService = req.scope.resolve(Modules.PRODUCT);
    
    // Retrieve product type with error handling
    let productType;
    try {
      productType = await productService.retrieveProductType(productTypeId);
    } catch (error) {
            //@ts-ignore
      return res.status(404).json({
        message: 'Product type not found',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    const parsed = productTypeFieldsMetadataSchema.safeParse(
      productType.metadata ?? {}
    );

    // If parsing fails, log the error but return default values
    if (!parsed.success) {
      console.error('Metadata parsing error:', (parsed as z.SafeParseError<typeof productTypeFieldsMetadataSchema>).error);
    }

    res.status(200).json({
      image: parsed.success && parsed.data.image ? parsed.data.image : null,
      success: true
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
            //@ts-ignore
      return res.status(400).json({
        message: 'Invalid request parameters',
        errors: error.errors
      });
    }
      //@ts-ignore
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  try {
    let bodyData = req.body;

    // Handle string body if received
    if (typeof bodyData === 'string') {
      try {
        bodyData = JSON.parse(bodyData);
      } catch (e) {
              //@ts-ignore
        return res.status(400).json({
          message: 'Invalid JSON in request body',
          error: 'Parse error'
        });
      }
    }

    // Handle form data if received
    if (bodyData instanceof FormData) {
      const formObj: Record<string, any> = {};
      for (const [key, value] of bodyData.entries()) {
        try {
          formObj[key] = typeof value === 'string' ? JSON.parse(value) : value;
        } catch {
          formObj[key] = value;
        }
      }
      bodyData = formObj;
    }

    // Validate URL parameters and body
    const { productTypeId } = paramsSchema.parse(req.params);
    const customFields = productTypeFieldsMetadataSchema.parse(bodyData);

    const productService = req.scope.resolve(Modules.PRODUCT);

    // Retrieve existing product type
    let productType;
    try {
      productType = await productService.retrieveProductType(productTypeId);
    } catch (error) {
            //@ts-ignore
      return res.status(404).json({
        message: 'Product type not found',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Update product type with new metadata
    try {
      const updatedProductType = await productService.updateProductTypes(
        productTypeId,
        {
          metadata: {
            ...productType.metadata,
            ...customFields,
          },
        },
      );

      res.status(200).json({
        message: 'Product type metadata updated successfully',
        product_type: updatedProductType
      });
    } catch (error) {
      //@ts-ignore
      return res.status(400).json({
        message: 'Failed to update product type metadata',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
            //@ts-ignore
      return res.status(400).json({
        message: 'Invalid request data',
        errors: error.errors
      });
    }
      //@ts-ignore
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}