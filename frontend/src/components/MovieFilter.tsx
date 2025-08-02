import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FilterOptions {
  type: string;
  director: string;
  yearFrom: string;
  yearTo: string;
  rating: string;
  location: string;
}

interface MovieFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export const MovieFilter: React.FC<MovieFilterProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    type: "",
    director: "",
    yearFrom: "",
    yearTo: "",
    rating: "",
    location: "",
  });

  const handleInputChange = (field: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  // Clear only the filter fields, don't clear the table
  const handleClearFilters = () => {
    setFilters({
      type: "",
      director: "",
      yearFrom: "",
      yearTo: "",
      rating: "",
      location: "",
    });
    // Don't call onClearFilters() here - that clears the table
  };

  // Close the dialog without clearing anything
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Filter Movies</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Fill any combination of fields to filter your movies
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
          </div>

          {/* Director Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Director
            </label>
            <Input
              placeholder="Enter director name..."
              value={filters.director}
              onChange={(e) => handleInputChange("director", e.target.value)}
            />
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              placeholder="Enter location..."
              value={filters.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          {/* Year Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year From
              </label>
              <Input
                type="number"
                placeholder="2000"
                value={filters.yearFrom}
                onChange={(e) => handleInputChange("yearFrom", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year To
              </label>
              <Input
                type="number"
                placeholder="2024"
                value={filters.yearTo}
                onChange={(e) => handleInputChange("yearTo", e.target.value)}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleInputChange("rating", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Rating</option>
              <option value="9">9+ Stars</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
              <option value="5">5+ Stars</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleApplyFilters}
            className="flex-1 hover:cursor-pointer"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="flex-1 hover:cursor-pointer"
          >
            Clear Fields
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 hover:cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
