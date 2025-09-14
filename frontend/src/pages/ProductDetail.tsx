import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarketplace, MarketplaceListing } from '../hooks/useMarketplace';
import { useNotification } from '../contexts/NotificationContext';
import { Star, MapPin, Calendar, User, Package, ArrowLeft, Heart, Share2, ShoppingCart, MessageCircle } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, loading } = useMarketplace();
  const { showNotification } = useNotification();
  const [product, setProduct] = useState<MarketplaceListing | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  useEffect(() => {
    if (listings.length > 0 && id) {
      const foundProduct = listings.find(item => item.id === id);
      setProduct(foundProduct || null);
      if (foundProduct) {
        setSelectedImage(foundProduct.image);
      }
    }
  }, [listings, id]);

  const handleBuyNow = () => {
    if (!product) return;
    
    const totalPrice = product.type === 'sell' ? 
      `₹${(parseFloat(product.price.replace('₹', '').replace(',', '')) * quantity).toLocaleString('en-IN')}` : 
      product.price;

    showNotification({
      type: 'success',
      title: 'Purchase Initiated',
      message: `Redirecting to payment gateway for ${product.title} (Quantity: ${quantity}, Total: ${totalPrice})`,
      duration: 6000
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    showNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.title} (Quantity: ${quantity}) has been added to your cart`,
      duration: 4000
    });
  };

  const handleContactSeller = () => {
    if (!product) return;
    showNotification({
      type: 'info',
      title: 'Contact Information',
      message: `Email: ${product.provider.toLowerCase().replace(/\s+/g, '')}@example.com | Phone: +91 98765 43210`,
      duration: 8000
    });
  };

  const handleShare = () => {
    if (!product) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showNotification({
      type: 'success',
      title: 'Link Copied',
      message: 'Product link has been copied to clipboard',
      duration: 3000
    });
  };

  const handleProposeTrade = () => {
    if (!product) return;
    const userOffer = prompt(`Propose a trade for ${product.title}\n\nWhat would you like to offer in exchange?`, '');
    if (userOffer && userOffer.trim()) {
      showNotification({
        type: 'success',
        title: 'Trade Proposal Sent',
        message: `Your trade offer has been sent to ${product.provider}`,
        duration: 4000
      });
    }
  };

  const handleClaimItem = () => {
    if (!product) return;
    const confirmClaim = confirm(`Would you like to claim this free item?\n\n${product.title}\nLocation: ${product.location}\nProvider: ${product.provider}`);
    if (confirmClaim) {
      showNotification({
        type: 'success',
        title: 'Item Claimed!',
        message: `You've successfully claimed ${product.title}. Contact details sent to your email.`,
        duration: 5000
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedImage || product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Gallery - Mock additional images */}
              <div className="grid grid-cols-4 gap-2">
                {[product.image, product.image, product.image, product.image].map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === img ? 'border-emerald-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.type === 'sell' ? 'bg-blue-100 text-blue-800' :
                    product.type === 'trade' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {product.type.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-medium">{product.rating}</span>
                    <span className="text-gray-500">(42 reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{product.provider}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(product.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-4">
                {product.type === 'sell' && (
                  <div className="text-3xl font-bold text-emerald-600">{product.price}</div>
                )}
                {product.type === 'trade' && (
                  <div className="text-lg text-gray-600">Trade for: {product.tradeFor || 'Open to offers'}</div>
                )}
                {product.type === 'free' && (
                  <div className="text-3xl font-bold text-emerald-600">FREE</div>
                )}
                
                {product.condition && (
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      product.condition === 'new' ? 'bg-green-100 text-green-800' :
                      product.condition === 'like-new' ? 'bg-blue-100 text-blue-800' :
                      product.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Condition: {product.condition.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Selector for sellable items */}
              {product.type === 'sell' && (
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {product.type === 'sell' && (
                  <>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Buy Now</span>
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="w-full border border-emerald-600 text-emerald-600 py-3 px-6 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                    >
                      Add to Cart
                    </button>
                  </>
                )}
                
                {product.type === 'trade' && (
                  <button
                    onClick={handleProposeTrade}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Propose Trade</span>
                  </button>
                )}
                
                {product.type === 'free' && (
                  <button
                    onClick={handleClaimItem}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Package className="h-5 w-5" />
                    <span>Claim Item</span>
                  </button>
                )}

                {/* Secondary Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleContactSeller}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact Seller</span>
                  </button>
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isFavorited 
                        ? 'border-red-300 text-red-600 bg-red-50' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Category and Badge */}
              <div className="flex items-center space-x-4 pt-4 border-t">
                <div>
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="ml-2 font-medium">{product.category}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Badge:</span>
                  <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    {product.badge}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t bg-gray-50 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
            
            {/* Additional Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><span className="font-medium">ID:</span> {product.id}</li>
                  <li><span className="font-medium">Type:</span> {product.type}</li>
                  <li><span className="font-medium">Listed:</span> {new Date(product.created_at).toLocaleDateString('en-IN')}</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><span className="font-medium">Name:</span> {product.provider}</li>
                  <li><span className="font-medium">Location:</span> {product.location}</li>
                  <li><span className="font-medium">Rating:</span> {product.rating}/5 ⭐</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Delivery & Returns</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>🚚 Local delivery available</li>
                  <li>📦 Pickup option available</li>
                  <li>↩️ 7-day return policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;