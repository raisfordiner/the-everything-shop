import { prisma } from "../util/db";

/**
 * Script to add default product variants to products that don't have any variants
 * This ensures all products have at least one variant for consistency
 */
async function addDefaultVariants() {
  try {
    console.log("Starting to add default variants to products without variants...\n");

    // Find all products that don't have any variants
    const productsWithoutVariants = await prisma.product.findMany({
      where: {
        is_deleted: false,
        productVariants: {
          none: {},
        },
      },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        images: true,
      },
    });

    console.log(`Found ${productsWithoutVariants.length} products without variants\n`);

    if (productsWithoutVariants.length === 0) {
      console.log("All products already have variants. Nothing to do.");
      return;
    }

    // Create default variants for each product
    let successCount = 0;
    let errorCount = 0;

    for (const product of productsWithoutVariants) {
      try {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            quantity: product.stockQuantity,
            variantAttributes: {},
            images: product.images,
            priceAdjustment: 0,
          },
        });

        console.log(`✓ Created default variant for product: ${product.name}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to create variant for product: ${product.name}`, error);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`Summary:`);
    console.log(`  Total products processed: ${productsWithoutVariants.length}`);
    console.log(`  Successfully created: ${successCount}`);
    console.log(`  Failed: ${errorCount}`);
    console.log("=".repeat(50) + "\n");

    // Verify results - show all products with their variant counts
    const allProducts = await prisma.product.findMany({
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            productVariants: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log("Current product variant counts:");
    allProducts.forEach((product) => {
      console.log(`  - ${product.name}: ${product._count.productVariants} variant(s)`);
    });
  } catch (error) {
    console.error("Error adding default variants:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addDefaultVariants()
  .then(() => {
    console.log("\n✓ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Script failed:", error);
    process.exit(1);
  });
