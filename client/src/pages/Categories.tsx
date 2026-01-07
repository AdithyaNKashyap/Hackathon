import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef
} from '@tanstack/react-table';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null
  });

  useEffect(() => {
    // Add small delay to ensure token is stored
    setTimeout(() => {
      fetchCategories();
    }, 100);
  }, []);

  useEffect(() => {
    // Filter categories based on search term
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      // Completely remove authentication for testing
      console.log('Fetching categories without authentication');
      const response = await axios.get('http://127.0.0.1:5000/api/categories');
      console.log('Categories response:', response.data);
      setCategories(response.data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (editingCategory) {
        response = await axios.put(
          `http://127.0.0.1:5000/api/categories/${editingCategory.id}`,
          formDataToSend,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setSuccess('Category updated successfully');
      } else {
        response = await axios.post(
          'http://127.0.0.1:5000/api/categories',
          formDataToSend,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setSuccess('Category created successfully');
      }

      fetchCategories();
      handleCloseModal();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:5000/api/categories/${deletingCategory.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Category deleted successfully');
      fetchCategories();
      setShowDeleteModal(false);
      setDeletingCategory(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: null });
    setError('');
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: null
    });
    setShowModal(true);
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const columnHelper = createColumnHelper<Category>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('image', {
      header: 'Image',
      cell: (info) => {
        const imageUrl = info.getValue();
        return imageUrl ? (
          <img 
            src={`http://127.0.0.1:5000${imageUrl}`} 
            alt="Category" 
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        ) : ('-');
      },
    }),
    columnHelper.accessor('created_at', {
      header: 'Status',
      cell: (info) => {
        // For demo purposes, show "Active" status
        // In a real app, this would come from the database
        return 'Active';
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const category = info.row.original;
        return (
          <div>
            <Button
              variant="primary"
              size="sm"
              className="me-2"
              onClick={() => handleEdit(category)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteClick(category)}
            >
              Delete
            </Button>
          </div>
        );
      },
    }),
  ] as ColumnDef<Category>[];

  const table = useReactTable({
    data: filteredCategories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Categories</h3>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add Category
            </Button>
          </div>
          <div className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '8px', padding: '12px' }}
            />
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCategories.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      {searchTerm ? 'No categories found matching your search' : 'No categories found'}
                    </p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter category name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ borderRadius: '8px', padding: '12px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter category description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ borderRadius: '8px', padding: '12px' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFormData({ ...formData, image: (e.target as HTMLInputElement).files?.[0] || null })}
                accept="image/*"
                style={{ borderRadius: '8px', padding: '12px' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} style={{ borderRadius: '8px', padding: '12px 24px' }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} style={{ backgroundColor: '#6f42c1', border: 'none', borderRadius: '8px', padding: '12px 24px' }}>
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the category "{deletingCategory?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Categories;
