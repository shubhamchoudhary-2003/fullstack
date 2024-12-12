// import { Modules } from '@medusajs/framework/utils';
// import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
// import { z } from 'zod';

// const collectionFieldsMetadataSchema = z.object({
//   image: z
//     .object({
//       id: z.string(),
//       url: z.string().url(),
//     })
//     .optional(),
//   description: z.string().optional(),
//   collection_page_image: z
//     .object({
//       id: z.string(),
//       url: z.string().url(),
//     })
//     .optional(),
//   collection_page_heading: z.string().optional(),
//   collection_page_content: z.string().optional(),
//   product_page_heading: z.string().optional(),
//   product_page_image: z
//     .object({
//       id: z.string(),
//       url: z.string().url(),
//     })
//     .optional(),
//   product_page_wide_image: z
//     .object({
//       id: z.string(),
//       url: z.string().url(),
//     })
//     .optional(),
//   product_page_cta_image: z
//     .object({
//       id: z.string(),
//       url: z.string().url(),
//     })
//     .optional(),
//   product_page_cta_heading: z.string().optional(),
//   product_page_cta_link: z.string().optional(),
// });

// export async function GET(
//   req: MedusaRequest,
//   res: MedusaResponse,
// ): Promise<void> {
//   const { collectionId } = req.params;
//   const productService = req.scope.resolve(Modules.PRODUCT);
//   const collection = await productService.retrieveProductCollection(
//     collectionId,
//   );

//   const parsed = collectionFieldsMetadataSchema.safeParse(
//     collection.metadata ?? {},
//   );

//   res.json({
//     image: parsed.success && parsed.data.image ? parsed.data.image : null,
//     description:
//       parsed.success && parsed.data.description ? parsed.data.description : '',
//     collection_page_image:
//       parsed.success && parsed.data.collection_page_image
//         ? parsed.data.collection_page_image
//         : null,
//     collection_page_heading:
//       parsed.success && parsed.data.collection_page_heading
//         ? parsed.data.collection_page_heading
//         : '',
//     collection_page_content:
//       parsed.success && parsed.data.collection_page_content
//         ? parsed.data.collection_page_content
//         : '',
//     product_page_heading:
//       parsed.success && parsed.data.product_page_heading
//         ? parsed.data.product_page_heading
//         : '',
//     product_page_image:
//       parsed.success && parsed.data.product_page_image
//         ? parsed.data.product_page_image
//         : null,
//     product_page_wide_image:
//       parsed.success && parsed.data.product_page_wide_image
//         ? parsed.data.product_page_wide_image
//         : null,
//     product_page_cta_image:
//       parsed.success && parsed.data.product_page_cta_image
//         ? parsed.data.product_page_cta_image
//         : null,
//     product_page_cta_heading:
//       parsed.success && parsed.data.product_page_cta_heading
//         ? parsed.data.product_page_cta_heading
//         : '',
//     product_page_cta_link:
//       parsed.success && parsed.data.product_page_cta_link
//         ? parsed.data.product_page_cta_link
//         : '',
//   });
// }

// export async function POST(
//   req: MedusaRequest<typeof collectionFieldsMetadataSchema>,
//   res: MedusaResponse,
// ): Promise<void> {
//   const { collectionId } = req.params;
//   const customFields = collectionFieldsMetadataSchema.parse(req.body);

//   const productService = req.scope.resolve(Modules.PRODUCT);
//   const collection = await productService.retrieveProductCollection(
//     collectionId,
//   );

//   const updatedCollection = await productService.updateProductCollections(
//     collectionId,
//     {
//       metadata: {
//         ...collection.metadata,
//         ...customFields,
//       },
//     },
//   );

//   res.json(updatedCollection);
// }


import { Modules } from '@medusajs/framework/utils';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { z } from 'zod';

const imageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
});

const collectionFieldsMetadataSchema = z.object({
  image: imageSchema.optional(),
  description: z.string().optional(),
  collection_page_image: imageSchema.optional(),
  collection_page_heading: z.string().optional(),
  collection_page_content: z.string().optional(),
  product_page_heading: z.string().optional(),
  product_page_image: imageSchema.optional(),
  product_page_wide_image: imageSchema.optional(),
  product_page_cta_image: imageSchema.optional(),
  product_page_cta_heading: z.string().optional(),
  product_page_cta_link: z.string().optional(),
});

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  try {
    const { collectionId } = req.params;
    const productService = req.scope.resolve(Modules.PRODUCT);
    
    const collection = await productService.retrieveProductCollection(
      collectionId,
    );

    const parsed = collectionFieldsMetadataSchema.safeParse(
      collection.metadata ?? {},
    );

    res.json({
      image: parsed.success && parsed.data.image ? parsed.data.image : null,
      description:
        parsed.success && parsed.data.description ? parsed.data.description : '',
      collection_page_image:
        parsed.success && parsed.data.collection_page_image
          ? parsed.data.collection_page_image
          : null,
      collection_page_heading:
        parsed.success && parsed.data.collection_page_heading
          ? parsed.data.collection_page_heading
          : '',
      collection_page_content:
        parsed.success && parsed.data.collection_page_content
          ? parsed.data.collection_page_content
          : '',
      product_page_heading:
        parsed.success && parsed.data.product_page_heading
          ? parsed.data.product_page_heading
          : '',
      product_page_image:
        parsed.success && parsed.data.product_page_image
          ? parsed.data.product_page_image
          : null,
      product_page_wide_image:
        parsed.success && parsed.data.product_page_wide_image
          ? parsed.data.product_page_wide_image
          : null,
      product_page_cta_image:
        parsed.success && parsed.data.product_page_cta_image
          ? parsed.data.product_page_cta_image
          : null,
      product_page_cta_heading:
        parsed.success && parsed.data.product_page_cta_heading
          ? parsed.data.product_page_cta_heading
          : '',
      product_page_cta_link:
        parsed.success && parsed.data.product_page_cta_link
          ? parsed.data.product_page_cta_link
          : '',
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve collection metadata",
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

    const { collectionId } = req.params;
    
    // Validate the parsed body
    const customFields = collectionFieldsMetadataSchema.parse(bodyData);

    const productService = req.scope.resolve(Modules.PRODUCT);
    const collection = await productService.retrieveProductCollection(
      collectionId,
    );

    const updatedCollection = await productService.updateProductCollections(
      collectionId,
      {
        metadata: {
          ...collection.metadata,
          ...customFields,
        },
      },
    );

    res.status(200).json({
      message: 'Collection metadata updated successfully',
      collection: updatedCollection
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
            //@ts-ignore
      return res.status(400).json({
        message: 'Invalid request data',
        errors: error.errors
      });
    }

    if (error instanceof Error && error.message.includes('collection')) {
      //@ts-ignore
      return res.status(404).json({
        message: 'Collection not found',
        error: error.message
      });
    }
  //@ts-ignore
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}