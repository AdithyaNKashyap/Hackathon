import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
}

interface SubCategory {
  id: number;
  name: string;
  category_name?: string;
  sub_category_name?: string;
}

const SubCategories: React.FC = () => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSubCategory, setDeletingSubCategory] = useState<SubCategory | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter subcategories based on search term
    const filtered = subCategories.filter(subCategory =>
      subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subCategory.category_name && subCategory.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (subCategory.sub_category_name && subCategory.sub_category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredSubCategories(filtered);
  }, [searchTerm, subCategories]);

  const fetchData = async () => {
    try {
      // Remove authentication headers for testing
      const [subCategoriesRes, categoriesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/subcategories'),
        axios.get('http://127.0.0.1:5000/api/categories')
      ]);
      setSubCategories(subCategoriesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSubCategory) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:5000/api/subcategories/${deletingSubCategory.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Sub Category deleted successfully');
      fetchData();
      setShowDeleteModal(false);
      setDeletingSubCategory(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete sub category');
    }
  };

  const handleDeleteClick = (subCategory: SubCategory) => {
    setDeletingSubCategory(subCategory);
    setShowDeleteModal(true);
  };

  const columnHelper = createColumnHelper<SubCategory>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('category_name', {
      header: 'Category',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('sub_category_name', {
      header: 'Sub Category',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const subCategory = info.row.original;
        return (
          <div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteClick(subCategory)}
            >
              Delete
            </Button>
          </div>
        );
      },
    }),
  ] as ColumnDef<SubCategory>[];

  const table = useReactTable({
    data: filteredSubCategories,
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
            <h3>Sub Categories</h3>
            <Button variant="primary" onClick={() => navigate('/dashboard/subcategories/add')}>
              Add Sub Category
            </Button>
          </div>
          <div className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search subcategories by name, description, or category..."
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
                {filteredSubCategories.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      {searchTerm ? 'No subcategories found matching your search' : 'No sub categories found'}
                    </p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the sub category "{deletingSubCategory?.name}"?
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

export default SubCategories;
