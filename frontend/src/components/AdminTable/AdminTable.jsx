import React from 'react'
import { Button, Flex, Input, Select, Space, Table, Typography } from 'antd'
import { 
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const AdminTable = ({columnsTemplate, dataSource, rowSelection}) => {
    return (
        <>
            <Flex className="product__table" vertical gap={16}>
                <Flex justify='space-between'>
                    <Space>
                        <Select placeholder='Filter'></Select>
                        <Input.Search placeholder='Search'></Input.Search>
                    </Space>
                    <Space>
                        <Button icon={<EditOutlined />} type='primary' ghost></Button>
                        <Button icon={<DeleteOutlined />} type='primary' ghost></Button>
                    </Space>
                </Flex>
                <Table 
                    columns={columnsTemplate}
                    dataSource={dataSource}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    rowKey={item => item.id}
                    pagination={{position: ['bottomLeft']}}>
                </Table>
            </Flex>
        </>
    )
}

export default AdminTable
