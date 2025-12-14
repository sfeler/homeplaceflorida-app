import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const AMENITIES = [
  { key: 'pool', label: 'Pool' },
  { key: 'garage', label: 'Garage' },
  { key: 'waterfront', label: 'Waterfront' },
  { key: 'newConstruction', label: 'New Construction' },
];

export default function SearchFilters({ filters, onFilterChange, onSearch, onReset, searchQuery, onSearchQueryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleAmenityChange = (amenity, checked) => {
    const current = filters.amenities || [];
    const updated = checked 
      ? [...current, amenity]
      : current.filter(a => a !== amenity);
    handleChange('amenities', updated);
  };

  const handleReset = () => {
    onReset();
    setIsOpen(false);
  };

  const activeFilterCount = [
    filters.location,
    filters.minPrice,
    filters.maxPrice,
    filters.beds,
    filters.baths,
    filters.propertyType,
    filters.minSqft,
    filters.maxSqft,
    filters.minYear,
    filters.garage,
    ...(filters.amenities || [])
  ].filter(Boolean).length;

  const filterContent = (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="space-y-2">
        <Label>Search Properties</Label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery || ''}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full px-3 py-2 pl-10 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          placeholder="City or ZIP code"
          value={filters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Price</Label>
          <Select value={filters.minPrice || '0'} onValueChange={(val) => handleChange('minPrice', val === '0' ? '' : val)}>
            <SelectTrigger>
              <SelectValue placeholder="No min" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No min</SelectItem>
              <SelectItem value="100000">$100,000</SelectItem>
              <SelectItem value="200000">$200,000</SelectItem>
              <SelectItem value="300000">$300,000</SelectItem>
              <SelectItem value="400000">$400,000</SelectItem>
              <SelectItem value="500000">$500,000</SelectItem>
              <SelectItem value="750000">$750,000</SelectItem>
              <SelectItem value="1000000">$1,000,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Max Price</Label>
          <Select value={filters.maxPrice || '999999999'} onValueChange={(val) => handleChange('maxPrice', val === '999999999' ? '' : val)}>
            <SelectTrigger>
              <SelectValue placeholder="No max" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="999999999">No max</SelectItem>
              <SelectItem value="200000">$200,000</SelectItem>
              <SelectItem value="300000">$300,000</SelectItem>
              <SelectItem value="400000">$400,000</SelectItem>
              <SelectItem value="500000">$500,000</SelectItem>
              <SelectItem value="750000">$750,000</SelectItem>
              <SelectItem value="1000000">$1,000,000</SelectItem>
              <SelectItem value="2000000">$2,000,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Beds</Label>
          <Select value={filters.beds || '0'} onValueChange={(val) => handleChange('beds', val === '0' ? '' : val)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Baths</Label>
          <Select value={filters.baths || '0'} onValueChange={(val) => handleChange('baths', val === '0' ? '' : val)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property Type</Label>
        <Select value={filters.propertyType || 'all'} onValueChange={(val) => handleChange('propertyType', val === 'all' ? '' : val)}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="Single Family">Single Family Home</SelectItem>
            <SelectItem value="Condo">Condo</SelectItem>
            <SelectItem value="Townhouse">Townhouse</SelectItem>
            <SelectItem value="Multi-Family">Multi-Family</SelectItem>
            <SelectItem value="Land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
            <span className="text-sm font-medium text-slate-700">Advanced Filters</span>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {/* Square Footage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Sq Ft</Label>
              <Select value={filters.minSqft || '0'} onValueChange={(val) => handleChange('minSqft', val === '0' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No min</SelectItem>
                  <SelectItem value="500">500 sqft</SelectItem>
                  <SelectItem value="1000">1,000 sqft</SelectItem>
                  <SelectItem value="1500">1,500 sqft</SelectItem>
                  <SelectItem value="2000">2,000 sqft</SelectItem>
                  <SelectItem value="2500">2,500 sqft</SelectItem>
                  <SelectItem value="3000">3,000 sqft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Sq Ft</Label>
              <Select value={filters.maxSqft || '999999'} onValueChange={(val) => handleChange('maxSqft', val === '999999' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="999999">No max</SelectItem>
                  <SelectItem value="1000">1,000 sqft</SelectItem>
                  <SelectItem value="1500">1,500 sqft</SelectItem>
                  <SelectItem value="2000">2,000 sqft</SelectItem>
                  <SelectItem value="2500">2,500 sqft</SelectItem>
                  <SelectItem value="3000">3,000 sqft</SelectItem>
                  <SelectItem value="4000">4,000 sqft</SelectItem>
                  <SelectItem value="5000">5,000+ sqft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Year Built */}
          <div className="space-y-2">
            <Label>Year Built (min)</Label>
            <Select value={filters.minYear || '0'} onValueChange={(val) => handleChange('minYear', val === '0' ? '' : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Any year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any year</SelectItem>
                <SelectItem value="2020">2020 or newer</SelectItem>
                <SelectItem value="2010">2010 or newer</SelectItem>
                <SelectItem value="2000">2000 or newer</SelectItem>
                <SelectItem value="1990">1990 or newer</SelectItem>
                <SelectItem value="1980">1980 or newer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Garage */}
          <div className="space-y-2">
            <Label>Garage Spaces</Label>
            <Select value={filters.garage || '0'} onValueChange={(val) => handleChange('garage', val === '0' ? '' : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map((amenity) => (
                <div key={amenity.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.key}
                    checked={(filters.amenities || []).includes(amenity.key)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity.key, checked)}
                  />
                  <label
                    htmlFor={amenity.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleReset} variant="outline" className="flex-1 min-w-0">
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={() => { onSearch(); setIsOpen(false); }} className="flex-1 min-w-0 bg-amber-500 hover:bg-amber-600 text-slate-900">
          <Search className="mr-2 h-4 w-4" />
          Search
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-slate-900 text-white text-xs px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 lg:p-8">
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        {filterContent}
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter Properties
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Properties</SheetTitle>
              <SheetDescription>
                Refine your search to find the perfect home
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}