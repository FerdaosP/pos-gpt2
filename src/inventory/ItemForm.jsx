import React, { useState, useEffect } from 'react';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import { Form, Button } from 'react-bootstrap';
    import axios from 'axios'; // Import axios

    const ItemForm = ({onClose, onSave, initialItem}) => {
        const [form, setForm] = useState(initialItem || {
            sku: "",
            name: "",
            description: "",
            price: "",
            quantity_on_hand: "",
            category: "",
            costPrice: "",
            warrantyInfo: "",
        });

        const [categories, setCategories] = useState([]); // New state for categories
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

          useEffect(() => {
              setLoading(true);
                setError(null);
                 // Mock categories data
               const categoriesData = [
                     {
                    id: 1,
                    name: "Category A",
                     children: [
                        { id: 4, name: "Subcategory A1" },
                        { id: 5, name: "Subcategory A2" }
                     ]
                    },
                     {
                      id: 2,
                     name: "Category B",
                       children: [
                        { id: 6, name: "Subcategory B1" },
                        { id: 7, name: "Subcategory B2" }
                     ]
                    },
                    {
                        id: 3,
                       name: "Category C"
                    }
                ];

               setTimeout(() => {
                   setCategories(categoriesData)
                    setLoading(false);
                 }, 200);

        }, []);


        const handleChange = (e) => {
            const { name, value } = e.target;
            setForm({ ...form, [name]: value });
        };
        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(form)
        }
         if (loading) {
              return <div>Loading categories...</div>
          }

          if(error) {
              return <div className="text-red-500">Error loading categories.</div>
          }

        const renderCategoryOptions = (categories, level = 0) => {
            return categories.map(category => (
                <React.Fragment key={category.id}>
                    <option value={category.name} style={{ paddingLeft: `${level * 20}px` }}>
                        {category.name}
                    </option>
                    {category.children && renderCategoryOptions(category.children, level + 1)}
                </React.Fragment>
            ));
        };

        return (
            <Form onSubmit={handleSubmit}>
                  {!form.imei && (
                    <Form.Group className="mb-3">
                       <Form.Label>SKU:</Form.Label>
                       <Form.Control type="text" name="sku" value={form.sku} onChange={handleChange} required className="input-premium"/>
                   </Form.Group>
                  )}
                    <Form.Group className="mb-3">
                         <Form.Label>Name:</Form.Label>
                           <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required className="input-premium"/>
                       </Form.Group>
                      <Form.Group className="mb-3">
                          <Form.Label>Description:</Form.Label>
                            <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} rows={3} className="input-premium"/>
                     </Form.Group>
                     <Form.Group className="mb-3">
                        <Form.Label>Price:</Form.Label>
                         <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required className="input-premium"/>
                       </Form.Group>
                     <Form.Group className="mb-3">
                         <Form.Label>Quantity:</Form.Label>
                          <Form.Control type="number" name="quantity_on_hand" value={form.quantity_on_hand} onChange={handleChange} required className="input-premium"/>
                     </Form.Group>
                     <Form.Group className="mb-3">
                         <Form.Label>Category:</Form.Label>
                         <Form.Control
                            as="select"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                             className="select-premium"
                        >
                             <option value="" disabled>Select a category</option>
                                {renderCategoryOptions(categories)}
                        </Form.Control>
                     </Form.Group>
                     <Form.Group className="mb-3">
                        <Form.Label>Cost Price:</Form.Label>
                        <Form.Control
                            type="number"
                            name="costPrice"
                            value={form.costPrice}
                            onChange={handleChange}
                            className="input-premium"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Warranty Information:</Form.Label>
                        <Form.Control
                            type="text"
                            name="warrantyInfo"
                            value={form.warrantyInfo}
                            onChange={handleChange}
                            className="input-premium"
                        />
                    </Form.Group>
                    <div className="flex justify-end space-x-2 mt-4">
                         <Button variant="secondary" onClick={onClose}>Cancel</Button>
                          <Button variant="primary" type="submit">OK</Button>
                    </div>
               </Form>
        );
    };

    export default ItemForm;
