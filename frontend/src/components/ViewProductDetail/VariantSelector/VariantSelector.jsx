import React from "react"
import { Button, Typography } from "antd"
import './VariantSelector.css'

const { Text } = Typography

const findMatchingKey = (variantOptions, type) => {
    const lowerType = type.toLowerCase()
    const keys = Object.keys(variantOptions)
    let key = keys.find(k => k.toLowerCase() === lowerType)
    if (!key) key = keys.find(k => k.toLowerCase().includes(lowerType))
    if (!key) {
        const pluralCandidates = [lowerType + "s", lowerType + "es", lowerType.replace(/y$/, "ies")]
        key = keys.find(k => pluralCandidates.some(p => k.toLowerCase() === p))
    }
    return key
}

const VariantSelector = ({
    variantTypes,
    variantOptions,
    productVariants,
    selectedAttributes,
    setSelectedAttributes
}) => {
    return (
        <div className="info__variants">
            {variantTypes.map((type) => {
                const optionsKey = findMatchingKey(variantOptions, type)
                if (!optionsKey) return null
                const options = variantOptions[optionsKey]

                return (
                    <div key={type} className="variant-group">
                        <Text strong>{type}:</Text>
                        <div className="variant-options">
                            {options.map((option) => {
                                const isValid = productVariants.some((v) =>
                                    Object.entries(selectedAttributes).every(
                                        ([attrKey, attrValue]) =>
                                            v.variantAttributes[attrKey.toLowerCase()] === attrValue
                                    ) &&
                                    v.variantAttributes[type.toLowerCase()] === option
                                )

                                const isSelected = selectedAttributes[type.toLowerCase()] === option

                                return (
                                    <Button
                                        key={option}
                                        // type={isSelected ? "primary" : "default"}
                                        disabled={!isValid}
                                        onClick={() => {
                                            setSelectedAttributes((prev) => {
                                                const key = type.toLowerCase()
                                                if (prev[key] === option) {
                                                    const updated = { ...prev }
                                                    delete updated[key]
                                                    return updated
                                                }
                                                return { ...prev, [key]: option }
                                            })
                                        }}
                                        className={`variant-option ${isSelected ? 'variant-option--active' : ''}`}
                                    >
                                        {option}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default VariantSelector
