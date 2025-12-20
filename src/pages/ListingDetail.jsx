import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/api/entities';
import { MapPin, Bed, Bath, Square, Calendar, Car, Waves, ArrowLeft, Youtube, Image, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ContactForm from '../components/shared/ContactForm';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SEOHead, { generatePropertySEO } from '../components/shared/SEOHead';

export default function ListingDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const lightboxRef = useRef(null);
  const lastTouchDistance = useRef(0);
  const lastTouchCenter = useRef({ x: 0, y: 0 });

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const properties = await Property.filter({ id: propertyId, status: 'Active' });
      return properties[0];
    },
    enabled: !!propertyId
  });

  // Handle both base64 and URL paths for images
  const getImageSrc = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&q=80';
    // If it's already a base64 string or full URL, use it directly
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
      return imagePath;
    }
    // Otherwise it's a relative path, use as-is
    return imagePath;
  };

  const images = property?.images?.length > 0 
    ? property.images.map(img => getImageSrc(img))
    : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&q=80'];
    
  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  const seo = property ? generatePropertySEO(property) : null;

  // Enhanced breadcrumb structured data
  const breadcrumbData = property ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://homeplaceflorida.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Listings",
        "item": "https://homeplaceflorida.com/Listings"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": property.city,
        "item": `https://homeplaceflorida.com/Listings?location=${property.city}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": property.title,
        "item": `https://homeplaceflorida.com/ListingDetail?id=${property.id}`
      }
    ]
  } : null;

  // Open lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = '';
  }, []);

  // Navigate to next/previous image
  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToNext, goToPrevious, closeLightbox]);

  // Constrain position when zoomed
  useEffect(() => {
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    } else if (imageRef.current) {
      const img = imageRef.current;
      const maxX = (img.offsetWidth * zoom - window.innerWidth) / 2;
      const maxY = (img.offsetHeight * zoom - window.innerHeight) / 2;
      setPosition(prev => ({
        x: Math.max(-maxX, Math.min(maxX, prev.x)),
        y: Math.max(-maxY, Math.min(maxY, prev.y))
      }));
    }
  }, [zoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Property not found</h1>
          <Link to={createPageUrl('Listings')}>
            <Button>Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate distance between two touches
  const getTouchDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate center point between two touches
  const getTouchCenter = (touch1, touch2) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  };

  // Handle touch events for pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      lastTouchDistance.current = distance;
      const center = getTouchCenter(e.touches[0], e.touches[1]);
      lastTouchCenter.current = center;
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = distance / lastTouchDistance.current;
      const newZoom = Math.min(Math.max(zoom * scale, 1), 5);
      setZoom(newZoom);
      
      if (newZoom > 1) {
        const center = getTouchCenter(e.touches[0], e.touches[1]);
        const deltaX = center.x - lastTouchCenter.current.x;
        const deltaY = center.y - lastTouchCenter.current.y;
        setPosition(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
      }
      
      lastTouchDistance.current = distance;
      lastTouchCenter.current = getTouchCenter(e.touches[0], e.touches[1]);
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Handle double tap to zoom on mobile
  const handleDoubleClick = (e) => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    if (!lightboxOpen) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * delta, 1), 5);
    setZoom(newZoom);
    
    if (newZoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Handle mouse drag for panning when zoomed
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {seo && (
        <SEOHead 
          title={seo.title}
          description={seo.description}
          keywords={seo.keywords}
          canonicalUrl={`https://homeplaceflorida.com/ListingDetail?id=${property.id}`}
          ogImage={seo.ogImage}
          ogType="product"
          structuredData={[...seo.structuredData, breadcrumbData].filter(Boolean)}
        />
      )}
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <Link to={createPageUrl('Listings')}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[60vh] min-h-[500px] cursor-pointer" onClick={() => openLightbox(currentImageIndex)}>
            <img
              src={images[currentImageIndex]}
              alt={`${property.title} - ${property.beds} bedroom ${property.property_type} for sale in ${property.city}, ${property.state} - Photo ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&q=80';
              }}
            />
            
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10" onClick={(e) => e.stopPropagation()}>
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-semibold text-slate-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-slate-600 text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.address}, {property.city}, {property.state} {property.zip}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-amber-600 mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <Badge variant="outline">{property.status}</Badge>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <Bed className="h-6 w-6 text-slate-400 mb-2" />
                  <div className="text-2xl font-semibold text-slate-900">{property.beds}</div>
                  <div className="text-sm text-slate-600">Bedrooms</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <Bath className="h-6 w-6 text-slate-400 mb-2" />
                  <div className="text-2xl font-semibold text-slate-900">{property.baths}</div>
                  <div className="text-sm text-slate-600">Bathrooms</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <Square className="h-6 w-6 text-slate-400 mb-2" />
                  <div className="text-2xl font-semibold text-slate-900">{property.sqft?.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Sq Ft</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <Car className="h-6 w-6 text-slate-400 mb-2" />
                  <div className="text-2xl font-semibold text-slate-900">{property.garage || 0}</div>
                  <div className="text-sm text-slate-600">Garage</div>
                </div>
              </div>
            </div>

            {/* YouTube Video Tour */}
            {property.youtube_url && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Youtube className="h-6 w-6 text-red-600" />
                  Video Tour
                </h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={property.youtube_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    title="Property Video Tour"
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </Card>
            )}

            {/* Photo Gallery */}
            {images.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Image className="h-6 w-6 text-amber-600" />
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div 
                      key={index} 
                      className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setCurrentImageIndex(index);
                        openLightbox(index);
                      }}
                    >
                      <img
                        src={img}
                        alt={`${property.title} in ${property.city} - ${property.property_type} interior/exterior view ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">About This Property</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description || 'No description available.'}
              </p>
            </Card>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Property Details */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Property Type</div>
                  <div className="font-medium text-slate-900">{property.property_type}</div>
                </div>
                {property.year_built && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Year Built</div>
                    <div className="font-medium text-slate-900">{property.year_built}</div>
                  </div>
                )}
                {property.lot_size && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Lot Size</div>
                    <div className="font-medium text-slate-900">{property.lot_size} acres</div>
                  </div>
                )}
                {property.hoa_fee && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">HOA Fee</div>
                    <div className="font-medium text-slate-900">${property.hoa_fee}/month</div>
                  </div>
                )}
                {property.pool && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Pool</div>
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                      <Waves className="h-4 w-4 text-blue-500" />
                      Yes
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6 shadow-xl">
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                  Interested in this property?
                </h3>
                <ContactForm 
                  propertyId={property.id}
                  defaultInterest="Schedule Tour"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Lightbox */}
      {lightboxOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === lightboxRef.current) {
              closeLightbox();
            }
          }}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-2 md:top-4 right-2 md:right-4 z-50 p-3 md:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm transition-all text-white touch-manipulation"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm transition-all text-white touch-manipulation"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm transition-all text-white touch-manipulation"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm md:text-base">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 z-50 flex gap-2">
            <button
              onClick={() => {
                const newZoom = Math.min(zoom + 0.5, 5);
                setZoom(newZoom);
                if (newZoom <= 1) setPosition({ x: 0, y: 0 });
              }}
              className="p-3 md:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm transition-all text-white touch-manipulation"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                const newZoom = Math.max(zoom - 0.5, 1);
                setZoom(newZoom);
                if (newZoom <= 1) setPosition({ x: 0, y: 0 });
              }}
              className="p-3 md:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm transition-all text-white touch-manipulation"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
          </div>

          {/* Image Container */}
          <div
            className="absolute inset-0 flex items-center justify-center p-4 md:p-8 touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
          >
            <img
              ref={imageRef}
              src={images[lightboxIndex]}
              alt={`${property.title} - Photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none'
              }}
              onMouseDown={handleMouseDown}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&q=80';
              }}
              draggable={false}
            />
          </div>
        </div>
      )}

    </div>
  );
}