import { useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Heart, ShoppingCart, Minus, Plus, Star, Truck, Shield, RefreshCw,
  ChevronLeft, Check, Package,
} from 'lucide-react';
import {
  Container, Section, Stack, Grid, Flex, Card, CardBody, Button, Badge,
  Divider,
} from '@/design-system';
import type { Product } from '../types';
import { useCartStore } from '../stores/cart.store';
import { useWishlistStore } from '../stores/wishlist.store';
import {
  formatPrice, getProductUrl, getStockStatusLabel, getStockStatusColor,
} from '../utils';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

function createMockProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    sku: 'SKU-' + overrides.id,
    name: 'Ù…Ù†ØªØ¬',
    slug: 'product-' + overrides.id,
    description: 'ÙˆØµÙ Ø§Ù„Ù…Ù†ØªØ¬',
    shortDescription: 'ÙˆØµÙ Ù‚ØµÙŠØ± Ù„Ù„Ù…Ù†ØªØ¬',
    price: { amount: 199, currency: 'SAR' },
    images: [
      {
        id: 'img-' + overrides.id,
        url: '/images/product-placeholder.jpg',
        alt: 'Ù…Ù†ØªØ¬',
        width: 500,
        height: 500,
        isPrimary: true,
      },
    ],
    categoryId: 'cat-1',
    categoryName: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ£Ø¯ÙˆØ§Øª',
    brand: 'TOKYO',
    rating: 4.5,
    reviewsCount: 25,
    reviews: [],
    variants: [],
    status: 'active',
    stockStatus: 'in_stock',
    stock: 50,
    tags: [],
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

const mockProduct: Product = {
  id: 'prod-detail-1',
  sku: 'SKU-12OZ-50',
  name: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© 12 Ø£ÙˆÙ†ØµØ©',
  slug: 'paper-cups-12oz',
  description:
    'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø©ØŒ Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù„Ù…Ø´Ø±ÙˆØ¨Ø§Øª Ø§Ù„Ø³Ø§Ø®Ù†Ø© Ù…Ø«Ù„ Ø§Ù„Ù‚Ù‡ÙˆØ© ÙˆØ§Ù„Ø´Ø§ÙŠ. Ù…ØµÙ†ÙˆØ¹Ø© Ù…Ù† ÙˆØ±Ù‚ Ø³Ù…ÙŠÙƒ Ù…Ù‚Ø§ÙˆÙ… Ù„Ù„Ø­Ø±Ø§Ø±Ø© ÙˆØ§Ù„ØªØ±Ø·ÙŠØ¨ØŒ Ø¨ØªØµÙ…ÙŠÙ… Ø£Ù†ÙŠÙ‚ ÙˆØ¹Ù…Ù„ÙŠ. Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù„Ù…Ù‚Ø§Ù‡ÙŠ ÙˆØ§Ù„Ù…Ø·Ø§Ø¹Ù… ÙˆØ§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ù…Ù†Ø²Ù„ÙŠ.',
  shortDescription: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø© Ù„Ù„Ù…Ø´Ø±ÙˆØ¨Ø§Øª Ø§Ù„Ø³Ø§Ø®Ù†Ø© - Ø¹Ø¨ÙˆØ© 50 Ù‚Ø·Ø¹Ø©',
  price: { amount: 79, currency: 'SAR', oldAmount: 120 },
  images: [
    { id: 'img-1', url: '/images/product-placeholder.jpg', alt: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© 12 Ø£ÙˆÙ†ØµØ©', width: 800, height: 800, isPrimary: true },
    { id: 'img-2', url: '/images/product-placeholder.jpg', alt: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© - Ø¬Ø§Ù†Ø¨', width: 800, height: 800, isPrimary: false },
    { id: 'img-3', url: '/images/product-placeholder.jpg', alt: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© - ØªÙØ§ØµÙŠÙ„', width: 800, height: 800, isPrimary: false },
    { id: 'img-4', url: '/images/product-placeholder.jpg', alt: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© - Ø§Ø³ØªØ¹Ù…Ø§Ù„', width: 800, height: 800, isPrimary: false },
    { id: 'img-5', url: '/images/product-placeholder.jpg', alt: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© - Ø¹Ø¨ÙˆØ©', width: 800, height: 800, isPrimary: false },
  ],
  categoryId: 'cat-1',
  categoryName: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ£ÙƒÙˆØ§Ø¨',
  brand: 'TOKYO',
  rating: 4.8,
  reviewsCount: 120,
  reviews: [
    { id: 'rev-1', rating: 5, title: 'Ø¬ÙˆØ¯Ø© Ù…Ù…ØªØ§Ø²Ø©', content: 'Ø£ÙƒÙˆØ§Ø¨ Ù…Ù…ØªØ§Ø²Ø© ÙˆØµÙ„Øª Ø¨Ø­Ø§Ù„Ø© Ù…Ù…ØªØ§Ø²Ø©. Ø£Ù†ØµØ­ Ø¨Ø§Ù„Ø´Ø±Ø§Ø¡.', author: 'Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…Ø¯', date: '2026-06-15', verified: true },
    { id: 'rev-2', rating: 5, title: 'Ø³Ø¹Ø© Ø¬ÙŠØ¯Ø©', content: 'Ø§Ù„Ø³Ø¹Ø© Ù…Ù…ØªØ§Ø²Ø© ÙˆØ§Ù„ÙˆØ±Ù‚ Ø³Ù…ÙŠÙƒ. Ù…Ù†Ø§Ø³Ø¨ Ù„Ù„Ù‚Ù‡ÙˆØ© Ø§Ù„Ø³Ø§Ø®Ù†Ø©.', author: 'Ø³Ø§Ø±Ø© Ø§Ù„Ø¹Ù„ÙŠ', date: '2026-06-10', verified: true },
    { id: 'rev-3', rating: 4, title: 'Ø¬ÙŠØ¯ Ø¬Ø¯Ø§Ù‹', content: 'Ù…Ù†ØªØ¬ Ø¬ÙŠØ¯ Ø¨Ø´ÙƒÙ„ Ø¹Ø§Ù…. Ø§Ù„Ø³Ø¹Ø± Ù…Ù†Ø§Ø³Ø¨.', author: 'Ø®Ø§Ù„Ø¯ Ø§Ù„Ø¹Ù…Ø±ÙŠ', date: '2026-06-05', verified: false },
    { id: 'rev-4', rating: 5, title: 'Ø£ÙØ¶Ù„ Ø£ÙƒÙˆØ§Ø¨ Ø§Ø³ØªØ®Ø¯Ù…ØªÙ‡Ø§', content: 'Ù…Ù† Ø£ÙØ¶Ù„ Ø§Ù„Ø£ÙƒÙˆØ§Ø¨ Ø§Ù„Ù„ÙŠ Ø§Ø³ØªØ®Ø¯Ù…ØªÙ‡Ø§. Ù…Ù‚Ø§ÙˆÙ…Ø© Ø¬ÙŠØ¯Ø© Ù„Ù„Ø­Ø±Ø§Ø±Ø©.', author: 'Ù†ÙˆØ±Ø© Ø§Ù„Ø³Ø§Ù„Ù…', date: '2026-05-28', verified: true },
    { id: 'rev-5', rating: 4, title: 'Ù…Ù†Ø§Ø³Ø¨ Ù„Ù„Ù…Ø­Ù„', content: 'Ø£Ø³ØªØ®Ø¯Ù…Ù‡Ø§ ÙÙŠ Ù…Ù‚Ù„ØªÙŠ ÙˆÙ‡ÙŠ Ù…Ù†Ø§Ø³Ø¨Ø© Ø¬Ø¯Ø§Ù‹. Ø§Ù„ØªÙˆØµÙŠÙ„ ÙƒØ§Ù† Ø³Ø±ÙŠØ¹.', author: 'Ù…Ø­Ù…Ø¯ Ø§Ù„Ø´Ù…Ø±ÙŠ', date: '2026-05-20', verified: true },
  ],
  variants: [
    { id: 'var-1', name: 'Ø£Ø¨ÙŠØ¶', sku: 'SKU-12OZ-W', price: { amount: 79, currency: 'SAR' }, stock: 50, attributes: { color: 'Ø£Ø¨ÙŠØ¶' } },
    { id: 'var-2', name: 'Ø¨Ù†ÙŠ', sku: 'SKU-12OZ-B', price: { amount: 85, currency: 'SAR' }, stock: 30, attributes: { color: 'Ø¨Ù†ÙŠ' } },
    { id: 'var-3', name: 'Ø£Ø³ÙˆØ¯', sku: 'SKU-12OZ-K', price: { amount: 89, currency: 'SAR' }, stock: 25, attributes: { color: 'Ø£Ø³ÙˆØ¯' } },
  ],
  status: 'active',
  stockStatus: 'in_stock',
  stock: 50,
  tags: ['Ø£ÙƒÙˆØ§Ø¨', 'ÙˆØ±Ù‚ÙŠØ©', 'Ù‚Ù‡ÙˆØ©', 'Ù…Ø´Ø±ÙˆØ¨Ø§Øª'],
  isNew: false,
  isFeatured: true,
  isBestSeller: true,
  discount: 34,
  createdAt: '2026-01-15',
  updatedAt: '2026-06-15',
};

const productCatalog: Product[] = [
  mockProduct,
  {
    ...mockProduct,
    id: 'prod-2', sku: 'SKU-8OZ-50', name: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© 8 Ø£ÙˆÙ†ØµØ©', slug: 'paper-cups-8oz',
    description: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© ØµØºÙŠØ±Ø© Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù„Ø¥Ø³Ø¨Ø±ÙŠØ³Ùˆ ÙˆØ§Ù„Ù…Ø´Ø±ÙˆØ¨Ø§Øª Ø§Ù„Ø³Ø§Ø®Ù†Ø©. Ù…ØµÙ†ÙˆØ¹Ø© Ù…Ù† ÙˆØ±Ù‚ Ø¹Ø§Ù„ÙŠ Ø§Ù„Ø¬ÙˆØ¯Ø© Ø¨Ø³Ø¹Ø© 8 Ø£ÙˆÙ†ØµØ©. Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù„Ù…Ù‚Ø§Ù‡ÙŠ Ø§Ù„ØªÙŠ ØªÙ‚Ø¯Ù… Ù…Ø´Ø±ÙˆØ¨Ø§Øª Ù…ØªÙ†ÙˆØ¹Ø©.',
    shortDescription: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© ØµØºÙŠØ±Ø© 8 Ø£ÙˆÙ†ØµØ© - Ø¹Ø¨ÙˆØ© 50 Ù‚Ø·Ø¹Ø©',
    price: { amount: 55, currency: 'SAR', oldAmount: 75 },
    rating: 4.6, reviewsCount: 89, discount: 27,
    variants: [
      { id: 'var-2a', name: 'Ø£Ø¨ÙŠØ¶', sku: 'SKU-8OZ-W', price: { amount: 55, currency: 'SAR' }, stock: 40, attributes: { color: 'Ø£Ø¨ÙŠØ¶' } },
      { id: 'var-2b', name: 'Ø£Ø³ÙˆØ¯', sku: 'SKU-8OZ-K', price: { amount: 60, currency: 'SAR' }, stock: 35, attributes: { color: 'Ø£Ø³ÙˆØ¯' } },
    ],
    reviews: [
      { id: 'rev-2-1', rating: 5, title: 'Ù…Ù…ØªØ§Ø²Ø© Ù„Ù„Ø¥Ø³Ø¨Ø±ÙŠØ³Ùˆ', content: 'Ø£ÙƒÙˆØ§Ø¨ Ø±Ø§Ø¦Ø¹Ø© Ù…Ù†Ø§Ø³Ø¨Ø© ØªÙ…Ø§Ù…Ø§Ù‹ Ù„Ù„Ø¥Ø³Ø¨Ø±ÙŠØ³Ùˆ.', author: 'Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡ Ø§Ù„Ø³Ø¹ÙŠØ¯', date: '2026-06-20', verified: true },
      { id: 'rev-2-2', rating: 4, title: 'Ø¬ÙˆØ¯Ø© Ø¬ÙŠØ¯Ø©', content: 'Ø§Ù„ÙˆØ±Ù‚ Ø³Ù…ÙŠÙƒ ÙˆØ§Ù„ØªØµÙ…ÙŠÙ… Ø£Ù†ÙŠÙ‚.', author: 'ÙØ§Ø·Ù…Ø© Ø§Ù„Ø²Ù‡Ø±Ø§Ø¡', date: '2026-06-18', verified: true },
    ],
  },
  {
    ...mockProduct,
    id: 'prod-3', sku: 'SKU-LID-100', name: 'ØºØ·Ø§Ø¡ ÙƒÙˆØ¨ Ø¨Ù„Ø§Ø³ØªÙŠÙƒÙŠ', slug: 'cup-lid',
    description: 'ØºØ·Ø§Ø¡ Ø¨Ù„Ø§Ø³ØªÙŠÙƒÙŠ Ø´ÙØ§Ù Ù…ØªÙˆØ§ÙÙ‚ Ù…Ø¹ Ø§Ù„Ø£ÙƒÙˆØ§Ø¨ Ø§Ù„ÙˆØ±Ù‚ÙŠØ© 12 Ø£ÙˆÙ†ØµØ©. ÙŠØ­Ù…ÙŠ Ø§Ù„Ù…Ø´Ø±ÙˆØ¨Ø§Øª Ù…Ù† Ø§Ù„ØªØ³Ø±Ø¨ ÙˆÙŠØ¨Ù‚ÙŠÙ‡Ø§ Ø³Ø§Ø®Ù†Ø© Ù„ÙØªØ±Ø© Ø£Ø·ÙˆÙ„. Ù…ØµÙ†ÙˆØ¹ Ù…Ù† Ø¨Ù„Ø§Ø³ØªÙŠÙƒ Ø¢Ù…Ù† Ù„Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„ØºØ°Ø§Ø¦ÙŠ.',
    shortDescription: 'ØºØ·Ø§Ø¡ Ø¨Ù„Ø§Ø³ØªÙŠÙƒÙŠ Ø´ÙØ§Ù Ù„Ù„Ø£ÙƒÙˆØ§Ø¨ 12 Ø£ÙˆÙ†ØµØ© - Ø¹Ø¨ÙˆØ© 100 Ù‚Ø·Ø¹Ø©',
    price: { amount: 35, currency: 'SAR' },
    rating: 4.5, reviewsCount: 156, discount: 0,
    variants: [],
    reviews: [
      { id: 'rev-3-1', rating: 5, title: 'ÙŠÙ†Ø§Ø³Ø¨ Ø§Ù„ÙƒÙˆØ¨ Ø¨Ø´ÙƒÙ„ Ù…Ù…ØªØ§Ø²', content: 'ØºØ·Ø§Ø¡ Ù…Ù…ØªØ§Ø² Ù„Ø§ ÙŠØªØ³Ø±Ø¹ ÙˆÙ„Ø§ ÙŠÙ†Ø²Ù„Ù‚.', author: 'Ù…Ø­Ù…Ø¯ Ø§Ù„Ø¹Ù…Ø±ÙŠ', date: '2026-06-22', verified: true },
    ],
  },
  {
    ...mockProduct,
    id: 'prod-4', sku: 'SKU-PLATE-9', name: 'ØµØ­Ù† ÙˆØ±Ù‚ÙŠ 9 Ø¥Ù†Ø´', slug: 'paper-plates-9',
    description: 'Ø£Ø·Ø¨Ø§Ù‚ ÙˆØ±Ù‚ÙŠØ© Ù…Ø³ØªØ¯ÙŠØ±Ø© Ø¨Ù‚Ø·Ø± 9 Ø¥Ù†Ø´ØŒ Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù„ÙˆØ¬Ø¨Ø§Øª Ø§Ù„Ø®ÙÙŠÙØ© ÙˆØ§Ù„Ø­Ù„ÙˆÙŠØ§Øª. Ù…Ù‚Ø§ÙˆÙ…Ø© Ù„Ù„Ø²ÙŠÙˆØª ÙˆØ§Ù„Ø³ÙˆØ§Ø¦Ù„ØŒ Ø³Ù‡Ù„Ø© Ø§Ù„ØªØ®Ù„Øµ Ù…Ù†Ù‡Ø§ Ø¨Ø¹Ø¯ Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù….',
    shortDescription: 'Ø£Ø·Ø¨Ø§Ù‚ ÙˆØ±Ù‚ÙŠØ© 9 Ø¥Ù†Ø´ - Ø¹Ø¨ÙˆØ© 50 Ù‚Ø·Ø¹Ø©',
    price: { amount: 45, currency: 'SAR', oldAmount: 65 },
    rating: 4.7, reviewsCount: 67, discount: 31,
    variants: [
      { id: 'var-4a', name: 'Ø£Ø¨ÙŠØ¶', sku: 'SKU-PLATE-W', price: { amount: 45, currency: 'SAR' }, stock: 60, attributes: { color: 'Ø£Ø¨ÙŠØ¶' } },
      { id: 'var-4b', name: 'Ø¨Ù†ÙŠ', sku: 'SKU-PLATE-B', price: { amount: 50, currency: 'SAR' }, stock: 45, attributes: { color: 'Ø¨Ù†ÙŠ' } },
    ],
    reviews: [
      { id: 'rev-4-1', rating: 5, title: 'éžå¸¸é€‚åˆ Ø§Ù„Ø­ÙÙ„Ø§Øª', content: 'Ø£Ø·Ø¨Ø§Ù‚ Ù…Ù…ØªØ§Ø²Ø© Ù„Ù„Ø­ÙÙ„Ø§Øª ÙˆØ§Ù„ØªØ¬Ù…Ø¹Ø§Øª.', author: 'Ù†ÙˆØ±Ø© Ø§Ù„Ø­Ø±Ø¨ÙŠ', date: '2026-06-25', verified: true },
    ],
  },
  {
    ...mockProduct,
    id: 'prod-5', sku: 'SKU-STIR-200', name: 'Ø¹ÙŠØ¯Ø§Ù† ØªÙ‚Ù„ÙŠØ¨ Ø®Ø´Ø¨ÙŠØ©', slug: 'wooden-stirrers',
    description: 'Ø¹ÙŠØ¯Ø§Ù† ØªÙ‚Ù„ÙŠØ¨ Ù…Ù† Ø§Ù„Ø®Ø´Ø¨ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠØŒ ØµØ¯ÙŠÙ‚Ø© Ù„Ù„Ø¨ÙŠØ¦Ø©. Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ù„Ù‚Ù‡ÙˆØ© ÙˆØ§Ù„Ø´Ø§ÙŠ ÙˆØ§Ù„Ù…Ø´Ø±ÙˆØ¨Ø§Øª Ø§Ù„Ø¨Ø§Ø±Ø¯Ø©. Ø·ÙˆÙ„ 19 Ø³Ù…ØŒ Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù„Ù…Ù‚Ø§Ù‡ÙŠ ÙˆØ§Ù„ÙƒÙˆÙÙŠÙ‡Ø§Øª.',
    shortDescription: 'Ø¹ÙŠØ¯Ø§Ù† ØªÙ‚Ù„ÙŠØ¨ Ø®Ø´Ø¨ÙŠØ© 19 Ø³Ù… - Ø¹Ø¨ÙˆØ© 200 Ù‚Ø·Ø¹Ø©',
    price: { amount: 22, currency: 'SAR' },
    rating: 4.4, reviewsCount: 200, discount: 0,
    variants: [],
    reviews: [
      { id: 'rev-5-1', rating: 5, title: '.eco-friendly ÙˆÙ…Ù…ØªØ§Ø²Ø©', content: 'Ø¹ÙŠØ¯Ø§Ù† Ø®Ø´Ø¨ÙŠØ© Ø¬ÙŠØ¯Ø© Ø¬Ø¯Ø§Ù‹ ÙˆØµØ¯ÙŠÙ‚Ø© Ù„Ù„Ø¨ÙŠØ¦Ø©.', author: 'Ø³Ø¹ÙˆØ¯ Ø§Ù„Ø¯ÙˆØ³Ø±ÙŠ', date: '2026-06-28', verified: true },
    ],
  },
  {
    ...mockProduct,
    id: 'prod-6', sku: 'SKU-NAP-200', name: 'Ù…Ù†Ø§Ø¯ÙŠÙ„ ÙˆØ±Ù‚ÙŠØ© Ù…Ø·ÙˆÙŠØ©', slug: 'paper-napkins',
    description: 'Ù…Ù†Ø§Ø¯ÙŠÙ„ ÙˆØ±Ù‚ÙŠØ© Ù†Ø§Ø¹Ù…Ø© ÙˆÙ…ØªÙŠÙ†Ø©ØŒ Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù„Ø·Ø¹Ø§Ù… ÙˆØ§Ù„Ù…Ø´Ø±ÙˆØ¨Ø§Øª. Ù…ØµÙ†ÙˆØ¹Ø© Ù…Ù† ÙˆØ±Ù‚ Ø¹Ø§Ù„ÙŠ Ø§Ù„Ø§Ù…ØªØµØ§Øµ. Ù…ØªÙˆÙØ±Ø© Ø¨Ø£Ù„ÙˆØ§Ù† Ù…ØªØ¹Ø¯Ø¯Ø© ØªÙ†Ø§Ø³Ø¨ Ø¯ÙŠÙƒÙˆØ± Ø§Ù„Ù…Ø·Ø¹Ù… Ø£Ùˆ Ø§Ù„Ù…Ù‚Ù‡Ù‰.',
    shortDescription: 'Ù…Ù†Ø§Ø¯ÙŠÙ„ ÙˆØ±Ù‚ÙŠØ© Ù…Ø·ÙˆÙŠØ© - Ø¹Ø¨ÙˆØ© 200 Ù…Ù†Ø¯ÙŠÙ„',
    price: { amount: 28, currency: 'SAR', oldAmount: 35 },
    rating: 4.3, reviewsCount: 130, discount: 20,
    variants: [
      { id: 'var-6a', name: 'Ø£Ø¨ÙŠØ¶', sku: 'SKU-NAP-W', price: { amount: 28, currency: 'SAR' }, stock: 80, attributes: { color: 'Ø£Ø¨ÙŠØ¶' } },
      { id: 'var-6b', name: 'Ø£Ø³ÙˆØ¯', sku: 'SKU-NAP-K', price: { amount: 30, currency: 'SAR' }, stock: 50, attributes: { color: 'Ø£Ø³ÙˆØ¯' } },
    ],
    reviews: [
      { id: 'rev-6-1', rating: 4, title: 'Ù†Ø§Ø¹Ù…Ø© ÙˆÙ…ØªÙŠÙ†Ø©', content: 'Ù…Ù†Ø§Ø¯ÙŠÙ„ Ø¬ÙŠØ¯Ø© Ø§Ù„Ø§Ù…ØªØµØ§Øµ ÙˆØ§Ù„Ù…Ù„Ù…Ø³.', author: 'Ø±Ø§Ø¦Ø¯ Ø§Ù„Ù‚Ø­Ø·Ø§Ù†ÙŠ', date: '2026-07-01', verified: true },
    ],
  },
];

const productCatalogBySlug = new Map(productCatalog.map((p) => [p.slug, p]));

const relatedProducts: Product[] = [
  createMockProduct({ id: 'rel-1', name: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© 8 Ø£ÙˆÙ†ØµØ©', slug: 'paper-cups-8oz', price: { amount: 65, currency: 'SAR', oldAmount: 85 }, rating: 4.6, reviewsCount: 89, discount: 24 }),
  createMockProduct({ id: 'rel-2', name: 'ØºØ·Ø§Ø¡ ÙƒÙˆØ¨ Ø¨Ù„Ø§Ø³ØªÙŠÙƒÙŠ', slug: 'cup-lid', price: { amount: 30, currency: 'SAR' }, rating: 4.5, reviewsCount: 156 }),
  createMockProduct({ id: 'rel-3', name: 'Ø£ÙƒÙˆØ§Ø¨ ÙˆØ±Ù‚ÙŠØ© 9 Ø¥Ù†Ø´', slug: 'paper-plates-9', price: { amount: 55, currency: 'SAR', oldAmount: 70 }, rating: 4.7, reviewsCount: 67, discount: 21 }),
  createMockProduct({ id: 'rel-4', name: 'Ø¹ÙŠØ¯Ø§Ù† ØªÙ‚Ù„ÙŠØ¨ Ø®Ø´Ø¨ÙŠØ©', slug: 'wooden-stirrers', price: { amount: 18, currency: 'SAR' }, rating: 4.4, reviewsCount: 200 }),
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COLOR_MAP: Record<string, string> = {
  'Ø£Ø¨ÙŠØ¶': '#FFFFFF',
  'Ø¨Ù†ÙŠ': '#8B4513',
  'Ø£Ø³ÙˆØ¯': '#1A1A1A',
};

const TAB_IDS = ['description', 'specs', 'reviews', 'shipping'] as const;
type TabId = (typeof TAB_IDS)[number];

const TAB_LABELS: Record<TabId, string> = {
  description: 'Ø§Ù„ÙˆØµÙ',
  specs: 'Ø§Ù„Ù…ÙˆØ§ØµÙØ§Øª',
  reviews: 'Ø§Ù„ØªÙ‚ÙŠÙŠÙ…Ø§Øª',
  shipping: 'Ø§Ù„Ø´Ø­Ù† ÙˆØ§Ù„Ø§Ø³ØªØ±Ø¬Ø§Ø¹',
};

const RATING_DISTRIBUTION = [
  { stars: 5, percent: 65 },
  { stars: 4, percent: 30 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const SPECS: [string, string][] = [
  ['Ø§Ù„Ø³Ø¹Ø©', '12 Ø£ÙˆÙ†ØµØ© (350 Ù…Ù„)'],
  ['Ø§Ù„Ù…Ø§Ø¯Ø©', 'ÙˆØ±Ù‚ Ù…Ù‚Ø§ÙˆÙ… Ù„Ù„Ø­Ø±Ø§Ø±Ø©'],
  ['Ø§Ù„Ø¹Ø¯Ø¯ Ø¨Ø§Ù„Ø¹Ø¨ÙˆØ©', '50 Ù‚Ø·Ø¹Ø©'],
  ['Ø§Ù„Ù‚Ø·Ø± Ø§Ù„Ø¹Ù„ÙˆÙŠ', '90 Ù…Ù…'],
  ['Ø§Ù„Ù‚Ø·Ø± Ø§Ù„Ø³ÙÙ„ÙŠ', '60 Ù…Ù…'],
  ['Ø§Ù„Ø§Ø±ØªÙØ§Ø¹', '115 Ù…Ù…'],
  ['Ø§Ù„Ù„ÙˆÙ†', 'Ø£Ø¨ÙŠØ¶ / Ø¨Ù†ÙŠ / Ø£Ø³ÙˆØ¯'],
  ['Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…', 'Ù…Ø´Ø±ÙˆØ¨Ø§Øª Ø³Ø§Ø®Ù†Ø©'],
  ['Ø§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©', 'TOKYO'],
  ['Ø¨Ù„Ø¯ Ø§Ù„Ù…Ù†Ø´Ø£', 'Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©'],
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5" aria-label={'ØªÙ‚ÙŠÙŠÙ… ' + String(rating) + ' Ù…Ù† 5'}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const halfFilled = !filled && i < rating;
        return (
          <Star
            key={i}
            className={
              sizeClass +
              ' ' +
              (filled
                ? 'text-yellow-400 fill-yellow-400'
                : halfFilled
                  ? 'text-yellow-400 fill-yellow-200'
                  : 'text-gray-300')
            }
          />
        );
      })}
    </div>
  );
}

function Breadcrumbs({ product }: { product: Product }) {
  return (
    <nav aria-label="Ù…Ù„Ø§Ø­Ø© Ø§Ù„ØªÙ†Ù‚Ù„" className="py-4">
      <ol className="flex items-center gap-2 text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-gray-900 transition-colors">Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</Link>
        </li>
        <li aria-hidden="true"><ChevronLeft className="w-3.5 h-3.5" /></li>
        <li>
          <Link to="/products" className="hover:text-gray-900 transition-colors">Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª</Link>
        </li>
        <li aria-hidden="true"><ChevronLeft className="w-3.5 h-3.5" /></li>
        <li>
          <Link
            to={'/categories/' + product.categoryId}
            className="hover:text-gray-900 transition-colors"
          >
            {product.categoryName}
          </Link>
        </li>
        <li aria-hidden="true"><ChevronLeft className="w-3.5 h-3.5" /></li>
        <li className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</li>
      </ol>
    </nav>
  );
}

function ImageGallery({ images }: { images: Product['images'] }) {
  const initialIndex = images.findIndex((img) => img.isPrimary);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  return (
    <Stack gap="md">
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={images[selectedIndex]?.url ?? '/images/product-placeholder.jpg'}
          alt={images[selectedIndex]?.alt ?? 'Ø§Ù„Ù…Ù†ØªØ¬'}
          className="w-full h-full object-cover"
        />
      </div>
      <Grid cols={{ mobile: 4, tablet: 5, desktop: 5 }} gap="sm">
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => { setSelectedIndex(index); }}
            className={
              'aspect-square rounded-lg overflow-hidden border-2 transition-all ' +
              (index === selectedIndex
                ? 'border-gray-900 ring-2 ring-gray-900/20'
                : 'border-transparent hover:border-gray-300')
            }
            aria-label={img.alt}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </Grid>
    </Stack>
  );
}

function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  max,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max: number;
}) {
  return (
    <Flex align="center" gap="sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="ØªÙ‚Ù„ÙŠÙ„ Ø§Ù„ÙƒÙ…ÙŠØ©"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-12 text-center font-semibold text-lg" dir="ltr">{String(quantity)}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Ø²ÙŠØ§Ø¯Ø© Ø§Ù„ÙƒÙ…ÙŠØ©"
      >
        <Plus className="w-4 h-4" />
      </button>
    </Flex>
  );
}

function ReviewDistributionBar() {
  return (
    <Stack gap="sm">
      {RATING_DISTRIBUTION.map((item) => (
        <Flex key={item.stars} align="center" gap="sm" className="text-sm">
          <span className="w-3 text-gray-600">{String(item.stars)}</span>
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all"
              style={{ width: String(item.percent) + '%' }}
            />
          </div>
          <span className="w-8 text-left text-gray-500">{String(item.percent)}%</span>
        </Flex>
      ))}
    </Stack>
  );
}

function ReviewCard({ review }: { review: Product['reviews'][number] }) {
  const formattedDate = new Date(review.date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="p-4">
      <CardBody className="p-0">
        <Stack gap="sm">
          <Flex align="center" justify="between">
            <Flex align="center" gap="sm">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                {review.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{review.author}</p>
                <p className="text-xs text-gray-500">{formattedDate}</p>
              </div>
            </Flex>
            {review.verified && (
              <Badge variant="success" size="sm">
                <Check className="w-3 h-3 mr-1" />
                Ù…Ø´ØªØ±ÙŠ Ù…ÙˆØ«ÙˆÙ‚
              </Badge>
            )}
          </Flex>
          <StarRating rating={review.rating} size="sm" />
          <p className="text-sm font-medium text-gray-900">{review.title}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
        </Stack>
      </CardBody>
    </Card>
  );
}

function ProductSpecs() {
  return (
    <div className="divide-y divide-gray-100">
      {SPECS.map(([label, value]) => (
        <Flex key={label} align="center" className="py-3">
          <span className="w-40 text-sm text-gray-500">{label}</span>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </Flex>
      ))}
    </div>
  );
}

function ShippingInfo() {
  return (
    <Stack gap="lg">
      <Card className="p-4">
        <CardBody className="p-0">
          <Flex align="start" gap="md">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Ø§Ù„ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…Ø¬Ø§Ù†ÙŠ</p>
              <p className="text-sm text-gray-600">
                ØªÙˆØµÙŠÙ„ Ù…Ø¬Ø§Ù†ÙŠ Ù„Ù„Ø·Ù„Ø¨Ø§Øª ÙÙˆÙ‚ 200 Ø±ÙŠØ§Ù„. ÙŠØªÙ… Ø§Ù„ØªÙˆØµÙŠÙ„ Ø®Ù„Ø§Ù„ 3-5 Ø£ÙŠØ§Ù… Ø¹Ù…Ù„.
              </p>
            </div>
          </Flex>
        </CardBody>
      </Card>
      <Card className="p-4">
        <CardBody className="p-0">
          <Flex align="start" gap="md">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø¥Ø±Ø¬Ø§Ø¹</p>
              <p className="text-sm text-gray-600">
                ÙŠÙ…ÙƒÙ†Ùƒ Ø¥Ø±Ø¬Ø§Ø¹ Ø§Ù„Ù…Ù†ØªØ¬ Ø®Ù„Ø§Ù„ 30 ÙŠÙˆÙ…Ø§Ù‹ Ù…Ù† ØªØ§Ø±ÙŠØ® Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…. ÙŠØ¬Ø¨ Ø£Ù† ÙŠÙƒÙˆÙ† Ø§Ù„Ù…Ù†ØªØ¬ ÙÙŠ Ø­Ø§Ù„ØªÙ‡ Ø§Ù„Ø£ØµÙ„ÙŠØ© ØºÙŠØ± Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…Ø©.
              </p>
            </div>
          </Flex>
        </CardBody>
      </Card>
      <Card className="p-4">
        <CardBody className="p-0">
          <Flex align="start" gap="md">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Ø¶Ù…Ø§Ù† Ø§Ù„Ø¬ÙˆØ¯Ø©</p>
              <p className="text-sm text-gray-600">
                Ø¬Ù…ÙŠØ¹ Ù…Ù†ØªØ¬Ø§ØªÙ†Ø§ ØªØ®Ø¶Ø¹ Ù„Ø±Ù‚Ø§Ø¨Ø© Ø¬ÙˆØ¯Ø© ØµØ§Ø±Ù…Ø©. Ù†Ù„ØªØ²Ù… Ø¨Ø£Ø¹Ù„Ù‰ Ù…Ø¹Ø§ÙŠÙŠØ± Ø§Ù„Ø¬ÙˆØ¯Ø© ÙˆØ§Ù„Ø³Ù„Ø§Ù…Ø©.
              </p>
            </div>
          </Flex>
        </CardBody>
      </Card>
      <Card className="p-4">
        <CardBody className="p-0">
          <Flex align="start" gap="md">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Ø§Ù„ØªØºÙ„ÙŠÙ</p>
              <p className="text-sm text-gray-600">
                ÙŠØªÙ… ØªØºÙ„ÙŠÙ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø¨Ø¹Ù†Ø§ÙŠØ© ÙØ§Ø¦Ù‚Ø© Ù„Ø¶Ù…Ø§Ù† ÙˆØµÙˆÙ„Ù‡Ø§ Ø¨Ø­Ø§Ù„Ø© Ù…Ù…ØªØ§Ø²Ø©. ØªØºÙ„ÙŠÙ ØµØ¯ÙŠÙ‚ Ù„Ù„Ø¨ÙŠØ¦Ø©.
              </p>
            </div>
          </Flex>
        </CardBody>
      </Card>
    </Stack>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link to={getProductUrl(product.slug)} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images[0]?.url ?? '/images/product-placeholder.jpg'}
            alt={product.images[0]?.alt ?? product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.discount > 0 && (
            <Badge variant="danger" className="absolute top-2 right-2">
              -{String(product.discount)}%
            </Badge>
          )}
        </div>
        <CardBody className="p-3">
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-1">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-xs text-gray-500">({String(product.reviewsCount)})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price.amount)}</span>
            {product.price.oldAmount && product.price.oldAmount > product.price.amount && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price.oldAmount)}</span>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const currentProduct = (slug ? productCatalogBySlug.get(slug) : undefined) ?? mockProduct;
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, hasItem } = useWishlistStore();

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    currentProduct.variants[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>('description');

  const activeVariant = currentProduct.variants.find((v) => v.id === selectedVariant);
  const currentPrice = activeVariant?.price.amount ?? currentProduct.price.amount;
  const currentOldPrice = currentProduct.price.oldAmount;
  const isWishlisted = hasItem(currentProduct.id);

  const handleAddToCart = useCallback(() => {
    addItem({
      id: currentProduct.id,
      productId: currentProduct.id,
      variantId: selectedVariant,
      name: currentProduct.name,
      image: currentProduct.images[0]?.url ?? '',
      price: { amount: currentPrice, currency: 'SAR' },
      quantity,
      maxQuantity: currentProduct.stock,
      stockStatus: currentProduct.stockStatus,
    });
  }, [addItem, selectedVariant, currentPrice, quantity]);

  const handleWishlistToggle = useCallback(() => {
    toggleItem(currentProduct.id);
  }, [toggleItem]);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((q) => Math.min(q + 1, currentProduct.stock));
  }, []);

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  return (
    <main dir="rtl">
      <Container>
        <Breadcrumbs product={currentProduct} />

        {/* â”€â”€ Two-column layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Grid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="xl" className="mb-16">
          {/* Gallery â€” right side in RTL */}
          <div className="order-1 md:order-2">
            <ImageGallery images={currentProduct.images} />
          </div>

          {/* Product info â€” left side in RTL */}
          <div className="order-2 md:order-1">
            <Stack gap="lg">
              {/* Badges */}
              <Flex gap="sm" wrap>
                {currentProduct.isNew && <Badge variant="success">Ø¬Ø¯ÙŠØ¯</Badge>}
                {currentProduct.isBestSeller && <Badge variant="warning">Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹</Badge>}
                {currentProduct.discount > 0 && <Badge variant="danger">Ø®ØµÙ… {String(currentProduct.discount)}%</Badge>}
                <Badge variant="info">Ø¬ÙˆØ¯Ø© Ù…Ù…ØªØ§Ø²Ø©</Badge>
              </Flex>

              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {currentProduct.name}
              </h1>

              {/* Rating */}
              <Flex align="center" gap="sm">
                <StarRating rating={currentProduct.rating} />
                <span className="text-sm font-medium text-gray-900">{String(currentProduct.rating)}</span>
                <span className="text-sm text-gray-500">({String(currentProduct.reviewsCount)} ØªÙ‚ÙŠÙŠÙ…)</span>
                <Divider orientation="vertical" className="h-4 mx-1" />
                <span className={'text-sm font-medium ' + getStockStatusColor(currentProduct.stockStatus)}>
                  {getStockStatusLabel(currentProduct.stockStatus)}
                </span>
              </Flex>

              {/* Price */}
              <Flex align="center" gap="sm" wrap>
                <span className="text-3xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
                {currentOldPrice && currentOldPrice > currentPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(currentOldPrice)}</span>
                    <Badge variant="danger" size="sm">
                      ÙˆÙØ± {formatPrice(currentOldPrice - currentPrice)}
                    </Badge>
                  </>
                )}
              </Flex>

              <Divider />

              {/* Short description */}
              <p className="text-sm text-gray-600 leading-relaxed">{currentProduct.shortDescription}</p>

              {/* Color / variant selector */}
              {currentProduct.variants.length > 0 && (
                <Stack gap="sm">
                  <p className="text-sm font-medium text-gray-900">
                    Ø§Ù„Ù„ÙˆÙ†: <span className="font-normal text-gray-600">{activeVariant?.name ?? ''}</span>
                  </p>
                  <Flex gap="sm">
                    {currentProduct.variants.map((variant) => {
                      const colorValue: string = (COLOR_MAP[variant.attributes.color ?? ''] as string | undefined) ?? '#CCCCCC';
                      const isSelected = variant.id === selectedVariant;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => { setSelectedVariant(variant.id); setQuantity(1); }}
                          className={
                            'relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ' +
                            (isSelected
                              ? 'border-gray-900 ring-2 ring-gray-900/20'
                              : 'border-gray-300 hover:border-gray-400')
                          }
                          aria-label={variant.name}
                          title={variant.name}
                        >
                          <span
                            className="w-7 h-7 rounded-full border border-gray-200"
                            style={{ backgroundColor: colorValue }}
                          />
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </Flex>
                </Stack>
              )}

              {/* Quantity + Add to cart */}
              <Stack gap="md">
                <Flex align="center" gap="lg" wrap>
                  <Stack gap="xs">
                    <p className="text-sm font-medium text-gray-900">Ø§Ù„ÙƒÙ…ÙŠØ©</p>
                    <QuantitySelector
                      quantity={quantity}
                      onIncrease={handleIncreaseQuantity}
                      onDecrease={handleDecreaseQuantity}
                      max={currentProduct.stock}
                    />
                  </Stack>
                  <p className="text-xs text-gray-500">
                    {String(currentProduct.stock)} Ù‚Ø·Ø¹Ø© Ù…ØªØ§Ø­Ø©
                  </p>
                </Flex>

                <Flex gap="sm">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={currentProduct.stockStatus === 'out_of_stock'}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {currentProduct.stockStatus === 'out_of_stock' ? 'ØºÙŠØ± Ù…ØªÙˆÙØ±' : 'Ø£Ø¶Ù Ø¥Ù„Ù‰ Ø§Ù„Ø³Ù„Ø©'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleWishlistToggle}
                    className={isWishlisted ? 'text-red-500 border-red-300' : ''}
                    aria-label={isWishlisted ? 'Ø¥Ø²Ø§Ù„Ø© Ù…Ù† Ø§Ù„Ù…ÙØ¶Ù„Ø©' : 'Ø¥Ø¶Ø§ÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ù…ÙØ¶Ù„Ø©'}
                  >
                    <Heart className={'w-5 h-5 ' + (isWishlisted ? 'fill-red-500' : '')} />
                  </Button>
                </Flex>
              </Stack>

              <Divider />

              {/* Trust badges */}
              <Grid cols={{ mobile: 3, tablet: 3, desktop: 3 }} gap="md">
                <Flex align="center" gap="sm">
                  <Truck className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">ØªÙˆØµÙŠÙ„ Ø³Ø±ÙŠØ¹</p>
                    <p className="text-[10px] text-gray-500">3-5 Ø£ÙŠØ§Ù… Ø¹Ù…Ù„</p>
                  </div>
                </Flex>
                <Flex align="center" gap="sm">
                  <Shield className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">Ø¯ÙØ¹ Ø¢Ù…Ù†</p>
                    <p className="text-[10px] text-gray-500">ØªØ´ÙÙŠØ± SSL</p>
                  </div>
                </Flex>
                <Flex align="center" gap="sm">
                  <RefreshCw className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">Ø¥Ø±Ø¬Ø§Ø¹ Ø³Ù‡Ù„</p>
                    <p className="text-[10px] text-gray-500">Ø®Ù„Ø§Ù„ 30 ÙŠÙˆÙ…</p>
                  </div>
                </Flex>
              </Grid>

              {/* SKU + tags */}
              <Stack gap="xs">
                <p className="text-xs text-gray-500">
                  Ø±Ù…Ø² Ø§Ù„Ù…Ù†ØªØ¬: <span className="text-gray-700">{currentProduct.sku}</span>
                </p>
                <Flex gap="sm" wrap>
                  {currentProduct.tags.map((tag) => (
                    <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                  ))}
                </Flex>
              </Stack>
            </Stack>
          </div>
        </Grid>

        {/* â”€â”€ Product tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Section padding="lg" className="border-t border-gray-200">
          <Stack gap="lg">
            <Flex gap="md" className="border-b border-gray-200 overflow-x-auto">
              {TAB_IDS.map((tabId) => (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => { setActiveTab(tabId); }}
                  className={
                    'relative pb-3 text-sm font-medium whitespace-nowrap transition-colors ' +
                    (activeTab === tabId
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700')
                  }
                >
                  {TAB_LABELS[tabId]}
                  {tabId === 'reviews' && (
                    <span className="mr-1 text-xs text-gray-400">({String(currentProduct.reviewsCount)})</span>
                  )}
                  {activeTab === tabId && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                  )}
                </button>
              ))}
            </Flex>

            {/* Tab content */}
            <div className="min-h-[200px]">
              {activeTab === 'description' && (
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <p className="mb-4">{currentProduct.description}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ø§Ù„Ù…Ù…ÙŠØ²Ø§Øª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>ÙˆØ±Ù‚ Ø³Ù…ÙŠÙƒ Ù…Ù‚Ø§ÙˆÙ… Ù„Ù„Ø­Ø±Ø§Ø±Ø© Ø­ØªÙ‰ 85 Ø¯Ø±Ø¬Ø© Ù…Ø¦ÙˆÙŠØ©</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Ù…Ù‚Ø§ÙˆÙ… Ù„Ù„ØªØ±Ø·ÙŠØ¨ ÙˆØ§Ù„ØªØ³Ø±Ø¨</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>ØªØµÙ…ÙŠÙ… Ø£Ù†ÙŠÙ‚ Ù…Ù†Ø§Ø³Ø¨ Ù„Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø§Øª</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Ù…ØµÙ†ÙˆØ¹Ø© Ù…Ù† Ù…ÙˆØ§Ø¯ Ø¢Ù…Ù†Ø© Ø¹Ù„Ù‰ Ø§Ù„ØµØ­Ø©</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Ø¹Ø¨ÙˆØ© Ø§Ù‚ØªØµØ§Ø¯ÙŠØ© ØªØ­ØªÙˆÙŠ 50 Ù‚Ø·Ø¹Ø©</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ù„Ù…Ù‚Ø§Ù‡ÙŠ ÙˆØ§Ù„Ù…Ø·Ø§Ø¹Ù… ÙˆØ§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ù…Ù†Ø²Ù„ÙŠ</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && <ProductSpecs />}

              {activeTab === 'reviews' && (
                <Stack gap="lg">
                  <Grid cols={{ mobile: 1, tablet: 3, desktop: 3 }} gap="lg">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-4xl font-bold text-gray-900 mb-1">{String(currentProduct.rating)}</p>
                      <StarRating rating={currentProduct.rating} />
                      <p className="text-sm text-gray-500 mt-1">{String(currentProduct.reviewsCount)} ØªÙ‚ÙŠÙŠÙ…</p>
                    </div>
                    <div className="col-span-2">
                      <ReviewDistributionBar />
                    </div>
                  </Grid>
                  <Stack gap="md">
                    {currentProduct.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </Stack>
                </Stack>
              )}

              {activeTab === 'shipping' && <ShippingInfo />}
            </div>
          </Stack>
        </Section>

        {/* â”€â”€ Related products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Section padding="lg" className="border-t border-gray-200">
          <Stack gap="lg">
            <Flex align="center" justify="between">
              <h2 className="text-xl font-bold text-gray-900">Ù…Ù†ØªØ¬Ø§Øª Ø°Ø§Øª ØµÙ„Ø©</h2>
              <Link
                to={'/categories/' + currentProduct.categoryId}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Ø¹Ø±Ø¶ Ø§Ù„ÙƒÙ„ â†
              </Link>
            </Flex>
            <Grid cols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
              {relatedProducts.map((product) => (
                <RelatedProductCard key={product.id} product={product} />
              ))}
            </Grid>
          </Stack>
        </Section>
      </Container>
    </main>
  );
}

export default ProductDetailsPage;
