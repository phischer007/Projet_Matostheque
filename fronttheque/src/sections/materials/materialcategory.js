import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { 
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Button,
  Stack,
  SvgIcon
} from '@mui/material';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { consumableTypes, lab_supplyTypes } from 'src/data/static_data';


export const MaterialCategory = forwardRef(({ materials = [], setFilteredMaterials, onCategoryChange, onReset }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Allow parent to trigger reset if needed
  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelectedCategory(null);
      setFilteredMaterials(materials);
    }
  }));

  const handleInternalReset = () => {
    // 1. Reset local state
    setSelectedCategory(null);
    
    // 2. Reset the list to show all materials
    setFilteredMaterials(materials);
    
    // 3. Trigger parent to reset Search Term and Page
    if (onReset) onReset();
  };

  const handleTagClick = (categoryValue, type) => {
    // Toggle off if clicking the already selected tag
    if (selectedCategory === categoryValue) {
      handleInternalReset();
      return;
    }

    setSelectedCategory(categoryValue);

    let filtered = [];
    if (type === "CONSUMABLES") {
      filtered = materials.filter(material => material.consumable_type === categoryValue);
    } else if (type === "LAB_SUPPLIES") {
      filtered = materials.filter(material => material.lab_supply_type === categoryValue);
    }

    setFilteredMaterials(filtered);
    
    // Notify parent to reset pagination
    if (onCategoryChange) onCategoryChange();
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        mt: 3, 
        mb: 3, 
        bgcolor: 'grey.100', // Gray background
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardContent>
        {/* Header with Title and Reset Button */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">
            Filter by Category
          </Typography>
          <Button
            startIcon={
              <SvgIcon fontSize="small">
                <ArrowPathIcon />
              </SvgIcon>
            }
            size="small"
            onClick={handleInternalReset}
            disabled={!selectedCategory} // Optional: Disable if no category is selected
            variant="text"
            color="primary"
          >
            Reset Filters
          </Button>
        </Stack>

        {/* SECTION 1: CONSUMABLES */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 1 }}>
          Consumables
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {consumableTypes.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              clickable
              color={selectedCategory === option.value ? "primary" : "default"}
              variant={selectedCategory === option.value ? "filled" : "outlined"}
              onClick={() => handleTagClick(option.value, "CONSUMABLES")}
              sx={{ bgcolor: selectedCategory === option.value ? 'primary.main' : 'background.paper' }}
            />
          ))}
        </Box>

        {/* SECTION 2: LAB SUPPLIES */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Lab Supplies
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {lab_supplyTypes.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              clickable
              color={selectedCategory === option.value ? "secondary" : "default"}
              variant={selectedCategory === option.value ? "filled" : "outlined"}
              onClick={() => handleTagClick(option.value, "LAB_SUPPLIES")}
              sx={{ bgcolor: selectedCategory === option.value ? 'secondary.main' : 'background.paper' }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
});

MaterialCategory.displayName = 'MaterialCategory';