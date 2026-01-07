import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    sub_category_id: '',
    stock: '',
    sku: '',
    images: [] as File[]
  });

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/subcategories');
      setSubCategories(response.data);
    } catch (error) {
      setError('Failed to fetch subcategories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('sub_category_id', formData.sub_category_id);
      formDataToSend.append('stock', formData.stock);
      if (formData.sku) {
        formDataToSend.append('sku', formData.sku);
      }
      
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await axios.post('http://127.0.0.1:5000/api/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Product created successfully');
      setTimeout(() => {
        navigate('/dashboard/products');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/products');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: files });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, category_id: e.target.value, sub_category_id: '' });
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3>Add Product</h3>
            <Button variant="secondary" onClick={handleCancel}>
              Back to Products
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={formData.category_id}
                        onChange={handleCategoryChange}
                        required
                        style={{ borderRadius: '8px', padding: '12px' }}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Sub Category</Form.Label>
                  <Form.Select
                    value={formData.sub_category_id}
                    onChange={(e) => setFormData({ ...formData, sub_category_id: e.target.value })}
                    required
                    disabled={!formData.category_id}
                    style={{ borderRadius: '8px', padding: '12px' }}
                  >
                    <option value="">Select a subcategory</option>
                    {subCategories
                      .filter(sub => sub.category_id === parseInt(formData.category_id))
                      .map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Image</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter stock quantity"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        placeholder="Enter product price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SKU</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter SKU (optional)"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ borderRadius: '8px', padding: '12px' }}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    style={{ borderRadius: '8px', padding: '12px 24px' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: '#6f42c1', border: 'none', borderRadius: '8px', padding: '12px 24px' }}
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
