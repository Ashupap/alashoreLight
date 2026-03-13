import { motion } from "framer-motion";
import { ArrowRight, Clock, Package } from "lucide-react";
import { Link } from "wouter";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { Product } from "@shared/schema";
import { STATIC_PRODUCTS } from "@/data/products";

// Function to get category color (case-insensitive)
const getCategoryColor = (category: string) => {
  const colors = {
    "hon/hl": "bg-emerald-500/90",
    "pd/pdto": "bg-blue-500/90",
    "pud": "bg-purple-500/90",
    "ezpl": "bg-orange-500/90",
    "fish": "bg-red-500/90",
    "raw frozen": "bg-cyan-500/90",
    "iqf shrimp": "bg-teal-500/90",
    "shell-on": "bg-indigo-500/90",
    "whole shrimp": "bg-pink-500/90",
    "shrimp": "bg-cyan-500/90",
    "crab": "bg-orange-600/90"
  };

  const normalizedCategory = category.toLowerCase();
  return colors[normalizedCategory as keyof typeof colors] || "bg-ocean-blue/90";
};

export default function Products() {
  const isLoading = false;
  const products = STATIC_PRODUCTS;

  // Default products data if API returns empty
  const defaultProducts = [
    {
      id: 1,
      name: "Frozen Peeled & Deveined Tail On IQF",
      description: "Premium quality individually quick frozen shrimp, peeled and deveined with tail on for optimal presentation.",
      featuredImage: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      category: "IQF Shrimp",
      order: 1
    },
    {
      id: 2,
      name: "Frozen Peeled & Deveined Tail-off IQF",
      description: "Expertly processed shrimp with tails removed, perfect for quick cooking and preparation in various dishes.",
      featuredImage: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      category: "IQF Shrimp",
      order: 2
    },
    {
      id: 3,
      name: "Raw Frozen Headless EZ Peel IQF",
      description: "Easy-to-peel headless shrimp, flash frozen to maintain freshness and quality for extended shelf life.",
      featuredImage: "https://pixabay.com/get/ge6101e05d916ad16ff53ee5c4ccaf2a11417049b9d90037ad187786d5ccbce0df11f3c823f6a54d998a07b397989a8f9997c3c6dc3644e660dab061f1e73f324_1280.jpg",
      category: "Raw Frozen",
      order: 3
    },
    {
      id: 4,
      name: "Frozen Headless Shell-On",
      description: "Traditional shell-on shrimp, headless and frozen to preserve natural flavors and textures.",
      featuredImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      category: "Shell-On",
      order: 4
    },
    {
      id: 5,
      name: "Raw Frozen Peeled & Un-Deveined IQF",
      description: "Peeled but un-deveined shrimp for customers who prefer to prepare their seafood with maximum control.",
      featuredImage: "https://pixabay.com/get/g5d2aaa5fc362d29f751e53e8bbfeb2a274c7219423c08ed89ec685a50d349395e4006e1818183d253be2da4ad8d4cb8071d2b62b2560df308b959bd324250d81_1280.jpg",
      category: "Raw Frozen",
      order: 5
    },
    {
      id: 6,
      name: "Frozen Headless",
      description: "Whole headless shrimp, perfect for traditional cooking methods and authentic seafood preparations.",
      featuredImage: "https://pixabay.com/get/gfac91fb21705eec985853c2f4492bb19800929a7885976bb69ac7d558e3437e50558ff0cddad3c17400dc95f8137baa527ac9c30a406fbd5514e37ed94e230de_1280.jpg",
      category: "Whole Shrimp",
      order: 6
    }
  ];

  // Sort products by order field (smaller first), then by id as fallback
  const sortedProducts = (products && products.length > 0 ? products : defaultProducts)
    .slice()
    .sort((a: any, b: any) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.id - b.id; // fallback to id if order is same
    });

  const displayProducts = sortedProducts;

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Premium Seafood Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our exceptional range of fresh, sustainably sourced seafood products
          </p>
        </motion.div>

        {isLoading ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[Autoplay({ delay: 4000 })]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {displayProducts.map((product: any, index: number) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                      whileHover={{ y: -8 }}
                      data-testid={`card-product-${product.id}`}
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={product.featuredImage}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      </div>

                      {/* Content Overlay */}
                      <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                        {/* Category Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(product.category)}`}>
                            {product.category}
                          </span>
                        </div>

                        {/* Product Info */}
                        <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                          <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 leading-tight">
                            {product.name}
                          </h3>

                          <p className="text-gray-100 mb-4 text-sm line-clamp-2 opacity-90">
                            {product.description}
                          </p>

                          {/* Product Details */}
                          <div className="flex items-center gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Package size={14} className="text-blue-300" />
                              <span className="text-gray-200">Fresh Frozen</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-blue-300" />
                              <span className="text-gray-200">Ready to Cook</span>
                            </div>
                          </div>
                        </div>
                      </div>


                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 md:-left-12 bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900" />
              <CarouselNext className="-right-4 md:-right-12 bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900" />
            </Carousel>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-ocean-blue text-white px-8 py-4 rounded-xl hover:bg-deep-navy transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
              data-testid="button-view-all-products"
            >
              Explore Full Catalog
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
