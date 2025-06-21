import { Truck, Shield, Gem, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const browseOptions = [
    {
      image: '/images/earrings1.jpg',
      title: 'Earrings',
      href: '/products?category=earring',
    },
    {
      image: '/images/ring1.jpg',
      title: 'Rings',
      href: '/products?category=ring',
    },
    {
      image: '/images/pearl-pendant.jpg',
      title: 'Pendants',
      href: '/products?category=pendant',
    },
    {
      image: '/images/necklace1.jpg',
      title: 'Necklaces',
      href: '/products?category=necklace',
    },
  ]
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
            Timeless
            <br />
            <span className="font-bold">Elegance</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover handcrafted jewelry that tells your story. Each piece is carefully selected for its exceptional quality and timeless design.
          </p>
          <Link href="/products" className="bg-black text-white px-8 py-4 text-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-light text-center mb-12">Browse Collection</h3>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 min-w-max px-6 justify-center">
              {browseOptions.map((option, index) => (
                <Link href={option.href} key={index}>
                <div className="group cursor-pointer flex-shrink-0 w-48">
                  <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <Image
                      src={option.image}
                      alt={option.title}
                      width={200}
                      height={200}
                    />
                  </div>
                  <h4 className="text-lg font-medium text-center">{option.title}</h4>
                </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-light text-center mb-12">Why Choose Us</h3>
          <div className="border-t pt-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <Truck className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-600 mt-1">Within India</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <Shield className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">Certified Jeweller</p>
                <p className="text-xs text-gray-600 mt-1">Trusted quality</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <Gem className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">Great Collection</p>
                <p className="text-xs text-gray-600 mt-1">Handpicked designs</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <RefreshCw className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">7 Day Exchange</p>
                <p className="text-xs text-gray-600 mt-1">Hassle-free returns</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}