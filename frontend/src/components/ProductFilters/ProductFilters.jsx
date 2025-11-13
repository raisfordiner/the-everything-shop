import {Button, Card, Checkbox, List, Rate, Slider, Space, Radio} from "antd";

const brands = [
    { name: 'Apple', count: 114 },
    { name: 'Samsung', count: 58 },
    { name: 'Xiaomi', count: 23 },
    { name: 'Oppo', count: 18 },
    { name: 'Photophone', count: 112 },
];

const screenSizes = ["< 5 inch", "5\" - 6\"", "6\" - 6.5\"", "6.5\" >"];

const FilterCard = ({ title, children, showReset = false }) => (
    <Card title={title} style={{ marginBottom: 16 }}
          extra={showReset && <Button type="link" size="small">Reset</Button>}
    >
        {children}
    </Card>
);

const ProductFilters = ({ onFilterChange }) => {
    const onPriceChange = (value) => {
        // [min, max]
        onFilterChange('priceRange', value);
    };

    const onBrandChange = (checkedValues) => {
        onFilterChange('brands', checkedValues);
    };

    const onRatingChange = (checkedValues) => {
        onFilterChange('ratings', checkedValues);
    };

    const onSizeChange = (checkedValues) => {
        onFilterChange('size', checkedValues.target.value);
    };

    return (
        <>
            <FilterCard title="By Brands" showReset>
                <Checkbox.Group style={{ width: '100%' }} onChange={onBrandChange}>
                    <List
                        size="small"
                        dataSource={brands}
                        renderItem={(item) => (
                            <List.Item style={{ border: 'none', padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                                <Checkbox value={item.name}>{item.name}</Checkbox>
                                <span style={{ color: '#999' }}>({item.count})</span>
                            </List.Item>
                        )}
                    />
                </Checkbox.Group>
            </FilterCard>

            <FilterCard title="By Price">
                <Slider
                    range
                    defaultValue={[0, 5000000]}
                    max={10000000}
                    step={100000}
                    tooltip={{ formatter: val => `${val.toLocaleString('vi-VN')} ₫` }}
                    onAfterChange={onPriceChange}
                />
            </FilterCard>

            <FilterCard title="By Rating" showReset>
                <Checkbox.Group style={{ width: '100%' }} onChange={onRatingChange}>
                    <Space direction="vertical">
                        <Checkbox value={5}><Rate disabled defaultValue={5} count={5} style={{ fontSize: 16 }} /></Checkbox>
                        <Checkbox value={4}><Rate disabled defaultValue={4} count={5} style={{ fontSize: 16 }} /></Checkbox>
                        <Checkbox value={3}><Rate disabled defaultValue={3} count={5} style={{ fontSize: 16 }} /></Checkbox>
                    </Space>
                </Checkbox.Group>
            </FilterCard>

            <FilterCard title="By Screen Size">
                <Radio.Group style={{ width: '100%' }} onChange={onSizeChange}>
                    <Space direction="vertical">
                        {screenSizes.map(size => <Radio key={size} value={size}>{size}</Radio>)}
                    </Space>
                </Radio.Group>
            </FilterCard>
        </>
    )
}

export default ProductFilters;