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
  category_id: number;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  category_name?: string;
  sub_category_id: number;
  sub_category_name?: string;
  images: string[];
  stock: number;
  sku?: string;
  created_at?: string;
  updated_at?: string;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.sub_category_name && product.sub_category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchData = async () => {
    try {
      // Remove authentication headers for testing
      const [productsRes, categoriesRes, subCategoriesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/products'),
        axios.get('http://127.0.0.1:5000/api/categories'),
        axios.get('http://127.0.0.1:5000/api/subcategories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setSubCategories(subCategoriesRes.data);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:5000/api/products/${deletingProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Product deleted successfully');
      fetchData();
      setShowDeleteModal(false);
      setDeletingProduct(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleDeleteClick = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const columnHelper = createColumnHelper<Product>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
    }),
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
    columnHelper.accessor('images', {
      header: 'Image',
      cell: (info) => {
        const images = info.getValue() as string[];
        return images.length > 0 ? (
          <img 
            src={`http://127.0.0.1:5000${images[0]}`} 
            alt="Product" 
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
        const product = info.row.original;
        return (
          <div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteClick(product)}
            >
              Delete
            </Button>
          </div>
        );
      },
    }),
  ] as ColumnDef<Product>[];

  const table = useReactTable({
    data: filteredProducts,
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
            <h3>Products</h3>
            <Button variant="primary" onClick={() => navigate('/dashboard/products/add')}>
              Add Product
            </Button>
          </div>
          <div className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search products by name, description, category, or subcategory..."
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
                {filteredProducts.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      {searchTerm ? 'No products found matching your search' : 'No products found'}
                    </p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
