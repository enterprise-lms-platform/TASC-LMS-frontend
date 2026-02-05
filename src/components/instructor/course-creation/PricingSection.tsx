import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import {
  CardGiftcard as FreeIcon,
  LocalOffer as PaidIcon,
  Autorenew as SubscriptionIcon,
} from '@mui/icons-material';

type PricingType = 'free' | 'paid' | 'subscription';

interface PricingData {
  pricingType: PricingType;
  price: number;
  originalPrice: number;
  currency: string;
}

interface PricingSectionProps {
  data: PricingData;
  onChange: (data: PricingData) => void;
}

const pricingOptions: {
  type: PricingType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    type: 'free',
    label: 'Free',
    description: 'Open access for all learners',
    icon: <FreeIcon />,
  },
  {
    type: 'paid',
    label: 'Paid',
    description: 'One-time purchase',
    icon: <PaidIcon />,
  },
  {
    type: 'subscription',
    label: 'Subscription',
    description: 'Part of subscription plan',
    icon: <SubscriptionIcon />,
  },
];

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'KES', label: 'KES - Kenyan Shilling' },
  { value: 'NGN', label: 'NGN - Nigerian Naira' },
];

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  KES: 'KSh',
  NGN: '₦',
};

const PricingSection: React.FC<PricingSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof PricingData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const currencySymbol = currencySymbols[data.currency] || '$';

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      {/* Section Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
          Pricing & Access
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set the pricing model for your course
        </Typography>
      </Box>

      {/* Pricing Options */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {pricingOptions.map((option) => {
          const isSelected = data.pricingType === option.type;
          return (
            <Paper
              key={option.type}
              onClick={() => handleChange('pricingType', option.type)}
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                border: 2,
                borderColor: isSelected ? 'primary.main' : 'grey.200',
                bgcolor: isSelected ? 'rgba(255, 164, 36, 0.05)' : 'transparent',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.light',
                },
              }}
            >
              <Box sx={{ color: 'primary.main', fontSize: '1.5rem', mb: 1.5 }}>
                {option.icon}
              </Box>
              <Typography fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
                {option.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.description}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Price Fields (only for paid/subscription) */}
      {data.pricingType !== 'free' && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            label="Course Price"
            placeholder="0.00"
            type="number"
            required
            value={data.price || ''}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography fontWeight={600} color="text.secondary">
                    {currencySymbol}
                  </Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            fullWidth
            label="Original Price (for discounts)"
            placeholder="0.00"
            type="number"
            value={data.originalPrice || ''}
            onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography fontWeight={600} color="text.secondary">
                    {currencySymbol}
                  </Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Box>
      )}

      {/* Currency */}
      <FormControl fullWidth>
        <InputLabel>Currency</InputLabel>
        <Select
          value={data.currency}
          label="Currency"
          onChange={(e) => handleChange('currency', e.target.value)}
        >
          {currencies.map((curr) => (
            <MenuItem key={curr.value} value={curr.value}>
              {curr.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default PricingSection;
export type { PricingData, PricingType };
