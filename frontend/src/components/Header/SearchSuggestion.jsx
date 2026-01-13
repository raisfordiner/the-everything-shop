import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchOutlined, RightOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Spin, Typography, Empty } from 'antd';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import productService from '../../services/productService';
import './SearchSuggestion.css';

const { Text } = Typography;

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const SearchSuggestion = ({ searchValue, onSearch, onClose }) => {
    const navigate = useNavigate();
    const categories = useSelector((state) => state.allCategories.categories);
    
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const debouncedSearch = useDebounce(searchValue, 300);
    const containerRef = useRef(null);

    // Generate search term suggestions based on input and categories
    const generateSearchSuggestions = useCallback((query) => {
        if (!query || query.length < 2) return [];

        const suggestions = [];
        const lowerQuery = query.toLowerCase();

        // Add category-based suggestions
        categories.forEach(category => {
            const categoryName = category.name.toLowerCase();
            if (categoryName.includes(lowerQuery) || lowerQuery.includes(categoryName)) {
                suggestions.push({
                    text: `${query} in ${category.name}`,
                    type: 'category',
                    categoryId: category.id
                });
            }
        });

        // Add common search modifiers
        const modifiers = ['cheap', 'best', 'new', 'sale', 'premium', 'pro', 'mini'];
        modifiers.forEach(modifier => {
            if (!lowerQuery.includes(modifier)) {
                suggestions.push({
                    text: `${modifier} ${query}`,
                    type: 'modifier'
                });
            }
        });

        // Add brand-like suggestions
        const popularTerms = ['samsung', 'apple', 'sony', 'lg', 'wireless', 'bluetooth'];
        popularTerms.forEach(term => {
            if (!lowerQuery.includes(term) && lowerQuery.length > 3) {
                suggestions.push({
                    text: `${query} ${term}`,
                    type: 'brand'
                });
            }
        });

        // Limit to 5 suggestions and prioritize category matches
        return suggestions
            .sort((a, b) => (a.type === 'category' ? -1 : 1))
            .slice(0, 5);
    }, [categories]);

    // Fetch products based on search
    useEffect(() => {
        const fetchProducts = async () => {
            if (!debouncedSearch || debouncedSearch.length < 2) {
                setSuggestedProducts([]);
                setSearchSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const response = await productService.getAllProducts({
                    search: debouncedSearch,
                    take: 5
                });
                
                setSuggestedProducts(response.data?.products || []);
                setSearchSuggestions(generateSearchSuggestions(debouncedSearch));
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [debouncedSearch, generateSearchSuggestions]);

    // Handle click on search suggestion
    const handleSuggestionClick = (suggestion) => {
        if (suggestion.categoryId) {
            navigate(`/category/${suggestion.categoryId}?search=${encodeURIComponent(suggestion.text)}`);
        } else {
            onSearch(suggestion.text);
        }
        onClose();
    };

    // Handle click on product
    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
        onClose();
    };

    // Handle "search for" click
    const handleSearchForClick = () => {
        onSearch(searchValue);
        onClose();
    };

    // Don't show if no search value or too short
    if (!searchValue || searchValue.length < 2) {
        return null;
    }

    const hasResults = searchSuggestions.length > 0 || suggestedProducts.length > 0;

    return (
        <div className="search-suggestion-container" ref={containerRef}>
            {loading ? (
                <div className="search-suggestion-loading">
                    <Spin size="small" />
                    <Text type="secondary">Searching...</Text>
                </div>
            ) : (
                <>
                    {/* Search for current query */}
                    <div 
                        className="search-suggestion-item search-for-item"
                        onClick={handleSearchForClick}
                    >
                        <SearchOutlined className="search-suggestion-icon" />
                        <span>Search for "<strong>{searchValue}</strong>"</span>
                        <RightOutlined className="search-suggestion-arrow" />
                    </div>

                    {/* Search Term Suggestions Section */}
                    {searchSuggestions.length > 0 && (
                        <div className="search-suggestion-section">
                            <div className="search-suggestion-section-title">
                                <SearchOutlined /> Suggested Searches
                            </div>
                            {searchSuggestions.map((suggestion, index) => (
                                <div
                                    key={`suggestion-${index}`}
                                    className="search-suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <SearchOutlined className="search-suggestion-icon" />
                                    <span 
                                        dangerouslySetInnerHTML={{
                                            __html: highlightMatch(suggestion.text, searchValue)
                                        }}
                                    />
                                    {suggestion.type === 'category' && (
                                        <span className="search-suggestion-badge">Category</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Product Suggestions Section */}
                    {suggestedProducts.length > 0 && (
                        <div className="search-suggestion-section">
                            <div className="search-suggestion-section-title">
                                <ShoppingOutlined /> Suggested Products
                            </div>
                            {suggestedProducts.map((product) => (
                                <div
                                    key={`product-${product.id}`}
                                    className="search-suggestion-product"
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    <img
                                        src={product.images?.[0] || '/placeholder.png'}
                                        alt={product.name}
                                        className="search-suggestion-product-image"
                                        onError={(e) => {
                                            e.target.src = '/placeholder.png';
                                        }}
                                    />
                                    <div className="search-suggestion-product-info">
                                        <span 
                                            className="search-suggestion-product-name"
                                            dangerouslySetInnerHTML={{
                                                __html: highlightMatch(product.name, searchValue)
                                            }}
                                        />
                                        <span className="search-suggestion-product-price">
                                            ${product.basePrice?.toLocaleString() || product.price?.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No results */}
                    {!hasResults && !loading && (
                        <div className="search-suggestion-empty">
                            <Empty 
                                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                description="No suggestions found"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// Helper function to highlight matching text
const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
};

// Helper to escape regex special characters
const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default SearchSuggestion;
