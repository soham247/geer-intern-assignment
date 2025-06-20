import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">B</span>
              </div>
              <h3 className="text-xl font-bold">Brand</h3>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <h4 className="text-lg font-semibold">Stay Updated</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form className="space-y-3 md:space-x-3 md:flex">
              <Input
                type="email"
                placeholder="Enter your email address"
                className=" text-white placeholder-gray-400 focus:border-black"
                required
              />
              <Button variant="outline" type="submit" className="bg-black w-full md:w-auto">
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <p className="text-gray-400 text-sm text-center py-4">
          © {currentYear} Brand. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;