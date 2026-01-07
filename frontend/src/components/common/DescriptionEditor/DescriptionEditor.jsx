import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Input,
  Space,
  Popconfirm,
  Empty,
  Typography,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import TinyMCEEditor from '../TextEditor/TextEditor';
import './DescriptionEditor.css';

const { Title, Text } = Typography;

export default function DescriptionEditor({ value, onChange, onUploadedImages }) {
  const [simpleText, setSimpleText] = useState('');
  const [sections, setSections] = useState([]);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionData, setEditingSectionData] = useState({ title: '', content: '' });

  // Initialize from value
  useEffect(() => {
    if (value) {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        // Support new format with both simpleText and sections
        if (parsed.simpleText !== undefined) {
          setSimpleText(parsed.simpleText || '');
          setSections(parsed.sections || []);
        }
        // Legacy format support
        else if (parsed.type === 'sections' && Array.isArray(parsed.sections)) {
          setSections(parsed.sections);
          setSimpleText('');
        } else if (parsed.type === 'simple' && typeof parsed.content === 'string') {
          setSimpleText(parsed.content);
          setSections([]);
        }
      } catch {
        // If parsing fails, treat as simple string
        setSimpleText(typeof value === 'string' ? value : '');
        setSections([]);
      }
    }
  }, []);

  // Notify parent of changes
  const notifyChange = (newSimpleText, newSections) => {
    const descriptionData = {
      simpleText: newSimpleText,
      sections: newSections,
    };
    onChange(JSON.stringify(descriptionData));
  };

  // Handle simple text change
  const handleSimpleTextChange = (content) => {
    setSimpleText(content);
    notifyChange(content, sections);
  };

  // Add new section
  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: 'New Section',
      content: '',
    };
    const newSections = [...sections, newSection];
    setSections(newSections);
    notifyChange(simpleText, newSections);
    // Auto-open for editing
    setEditingSectionId(newSection.id);
    setEditingSectionData({ title: 'New Section', content: '' });
  };

  // Start editing section
  const handleEditSection = (section) => {
    setEditingSectionId(section.id);
    setEditingSectionData({ title: section.title, content: section.content });
  };

  // Save edited section
  const handleSaveSection = () => {
    const newSections = sections.map((section) =>
      section.id === editingSectionId
        ? {
          ...section,
          title: editingSectionData.title,
          content: editingSectionData.content,
        }
        : section
    );
    setSections(newSections);
    notifyChange(simpleText, newSections);
    setEditingSectionId(null);
    setEditingSectionData({ title: '', content: '' });
  };

  // Auto-save section when editing (called on every editor change)
  const handleSectionContentChange = (content) => {
    const updatedEditingData = {
      ...editingSectionData,
      content: content,
    };
    setEditingSectionData(updatedEditingData);

    // Auto-save: update the section immediately in the parent state
    const newSections = sections.map((section) =>
      section.id === editingSectionId
        ? {
          ...section,
          title: updatedEditingData.title,
          content: updatedEditingData.content,
        }
        : section
    );
    setSections(newSections);
    notifyChange(simpleText, newSections);
  };

  // Delete section
  const handleDeleteSection = (id) => {
    const newSections = sections.filter((section) => section.id !== id);
    setSections(newSections);
    notifyChange(simpleText, newSections);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    // If it's a new section with default title and no content, remove it
    const section = sections.find(s => s.id === editingSectionId);
    if (section && section.title === 'New Section' && !section.content) {
      handleDeleteSection(editingSectionId);
    }
    setEditingSectionId(null);
    setEditingSectionData({ title: '', content: '' });
  };

  return (
    <div className="description-editor">
      {/* Simple Text Description - Required */}
      <div className="description-section">
        <Title level={5}>
          Product Description <Text type="danger">*</Text>
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Write a compelling description for your product. This is required.
        </Text>
        <TinyMCEEditor
          value={simpleText}
          onChange={handleSimpleTextChange}
          onUploadedImages={onUploadedImages}
        />
      </div>

      <Divider />

      {/* Sections - Optional */}
      <div className="description-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <Title level={5} style={{ marginBottom: 0 }}>Additional Sections</Title>
            <Text type="secondary">Optional: Add detailed sections like Features, Specifications, etc.</Text>
          </div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddSection}
            disabled={editingSectionId !== null}
          >
            Add Section
          </Button>
        </div>

        {sections.length === 0 ? (
          <div style={{ padding: 24, background: '#fafafa', borderRadius: 8, textAlign: 'center' }}>
            <Text type="secondary">No additional sections. Click "Add Section" to create one.</Text>
          </div>
        ) : (
          <div className="sections-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sections.map((section) => (
              <Card
                key={section.id}
                size="small"
                title={
                  editingSectionId === section.id ? (
                    <Input
                      value={editingSectionData.title}
                      onChange={(e) =>
                        setEditingSectionData({
                          ...editingSectionData,
                          title: e.target.value,
                        })
                      }
                      placeholder="Section title"
                      style={{ maxWidth: '300px' }}
                    />
                  ) : (
                    <span>{section.title}</span>
                  )
                }
                extra={
                  editingSectionId === section.id ? (
                    <Space size="small">
                      <Button
                        type="primary"
                        size="small"
                        onClick={handleSaveSection}
                      >
                        Done
                      </Button>
                      <Button
                        size="small"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </Space>
                  ) : (
                    <Space size="small">
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditSection(section)}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Delete Section"
                        description="Are you sure you want to delete this section?"
                        onConfirm={() => handleDeleteSection(section.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  )
                }
              >
                {editingSectionId === section.id ? (
                  <div className="editor-content">
                    <TinyMCEEditor
                      value={editingSectionData.content}
                      onChange={handleSectionContentChange}
                      onUploadedImages={onUploadedImages}
                    />
                  </div>
                ) : (
                  <div
                    className="section-content-preview"
                    dangerouslySetInnerHTML={{ __html: section.content || '<em>No content yet</em>' }}
                  />
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
