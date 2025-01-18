// File: /src/purchaseOrder/ViewSuppliersModal.jsx

    import React, { useState, useEffect, useCallback } from 'react';
    import CategoryForm from './CategoryForm';
    import axios from 'axios';

    const ViewCategoriesModal = ({
        isOpen,
        onClose,
        showAddCategoryForm,
        onToggleAddCategoryForm,
        onSaveCategory,
        onEditCategory,
        onDeleteCategory,
    }) => {
        const [categories, setCategories] = useState([]);
         const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [editingCategory, setEditingCategory] = useState(null);
        const apiUrl = 'http://localhost:8000/api/service-categories/'; // URL to get categories


       const fetchCategories = useCallback(async () => {
               setLoading(true);
                setError(null);
             // Mock categories data
                const mockCategories =  [
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
                   setCategories(mockCategories);
                   setLoading(false);
               }, 200);
             }, []);

        useEffect(() => {
            if(isOpen){
                  fetchCategories();
            }
        }, [isOpen, fetchCategories]); // Added isOpen and fetchCategories dependency


         const handleEditClick = (category) => {
            setEditingCategory(category);
        };

        const handleSaveEdit = async (updatedCategory) => {
            await onEditCategory(updatedCategory);
            setEditingCategory(null);
            await fetchCategories()
        };

        const handleCancelEdit = () => {
            setEditingCategory(null);
        };

        const handleDelete = async (categoryId) => {
            await onDeleteCategory(categoryId);
             await fetchCategories();
         }


        if (!isOpen) return null;
        if (loading) {
              return <div>Loading categories...</div>
          }

          if(error) {
              return <div className="text-red-500">Error loading categories.</div>
          }

        const renderCategories = (categories, level = 0) => {
            return categories.map(category => (
                <div key={category.id} className={`p-2 border rounded mb-2 flex justify-between items-center ${level > 0 ? 'ml-6' : ''}`}>
                    {editingCategory?.id === category.id ? (
                        <CategoryForm
                            initialCategory={editingCategory}
                            onSave={handleSaveEdit}
                            onClose={handleCancelEdit}
                        />
                    ) : (
                        <>
                            <span>{category.name}</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditClick(category)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)} // Pass the category ID
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                    {category.children && renderCategories(category.children, level + 1)}
                </div>
            ));
        };

        return (
            <div className="modal-premium">
                <div className="modal-content-premium">
                    <h2 className="text-xl font-semibold mb-4">Categories</h2>
                    {!showAddCategoryForm ? (
                        <>
                            {renderCategories(categories)}
                            <button
                                onClick={onToggleAddCategoryForm}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                            >
                                Add Category
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <CategoryForm onSave={onSaveCategory} onClose={onToggleAddCategoryForm} />
                            <button
                                onClick={onToggleAddCategoryForm}
                                className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                            >
                                Back to Categories
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    export default ViewCategoriesModal;
