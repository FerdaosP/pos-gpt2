import React, { useState, useEffect } from "react";
    import { AlertCircle, Download, FileText, File, Trash2, List } from "lucide-react";
    import { jsPDF } from 'jspdf';
    import 'jspdf-autotable';
    import axios from 'axios';

    import Alert, { AlertDescription } from "../reparatiekaart/Alert";
    import Loading from "../reparatiekaart/Loading";
    import ViewAttachmentsModal from "../reparatiekaart/ViewAttachmentsModal";
    import RepairHistoryModal from "../reparatiekaart/RepairHistoryModal";
    import { generateRepairID } from "../reparatiekaart/utils";
    import RepairTicketPrint from "../reparatiekaart/RepairTicketPrint";
    import ItemForm from "./ItemForm";
    import ViewCategoriesModal from "./ViewCategoriesModal";
    import DeleteInventoryModal from "./DeleteInventoryModal";
    import EditItemModal from "./EditItemModal";
    import AddItemTypeModal from "./AddItemTypeModal";
    import AddDeviceModal from "./AddDeviceModal";
    import EditDeviceModal from "./EditDeviceModal";
    import ItemList from "./ItemList";
    import DeviceList from "./DeviceList";


    const InventoryEntry = () => {
        const [inventory, setInventory] = useState([]);
        const [devices, setDevices] = useState([]);
        const [showAddItemModal, setShowAddItemModal] = useState(false);
        const [isLoadingAddItem, setIsLoadingAddItem] = useState(false);
        const [isLoadingDelete, setIsLoadingDelete] = useState(false);
        const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
        const [isLoadingExport, setIsLoadingExport] = useState(false);
        const [notification, setNotification] = useState(null);
        const [searchTerm, setSearchTerm] = useState("");
        const [filterCategory, setFilterCategory] = useState("");
        const [currentPage, setCurrentPage] = useState(1);
        const [itemsPerPage, setItemsPerPage] = useState(5);
        const [sortColumn, setSortColumn] = useState("name");
        const [sortDirection, setSortDirection] = useState("asc");
        const [editItem, setEditItem] = useState(null);
        const [deleteItemId, setDeleteItemId] = useState(null);
        const [selectedItems, setSelectedItems] = useState([]);
        const [showCategoryList, setShowCategoryList] = useState(false);
        const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
        const [categories, setCategories] = useState([]);
         const [showAddItemTypeModal, setShowAddItemTypeModal] = useState(false);
        const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
         const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
        const [activeList, setActiveList] = useState("items");

        const apiUrl = 'http://localhost:8000/api/products/';
         const deviceApiUrl = 'http://localhost:8000/api/devices/';
        const categoryUrl = 'http://localhost:8000/api/service-categories/';

        useEffect(() => {
            fetchInventory();
            fetchDevices();
            fetchCategories();
        }, []);

         const fetchCategories = async () => {
               // Mock categories data
                  const categoriesData = [
                    {
                     id: 1,
                        name: "Category A"
                   },
                   {
                     id: 2,
                     name: "Category B"
                   },
                    {
                       id: 3,
                       name: "Category C"
                    }
                ];
              setCategories(categoriesData);
            };
      const fetchDevices = async () => {
            setDevices([
             {
                    name: "iPhone 13",
                     description: "Apple iPhone 13",
                    price: 899.99,
                    quantity_on_hand: 15,
                    imei: "123456789012345",
                     storage: "128GB",
                     serial_number: "SN123456789",
                     costPrice: 700,
                     warrantyInfo: "1 year manufacturer warranty"
              },
              {
                  name: "Samsung S21",
                    description: "Samsung S21",
                     price: 799.99,
                  quantity_on_hand: 10,
                    imei: "987654321098765",
                    storage: "256GB",
                   serial_number: "SN987654321",
                   costPrice: 600,
                   warrantyInfo: "6 months store warranty"
              },
            ]);
        };

        const fetchInventory = async () => {
            setInventory([
                 {
                    sku: "SKU001",
                    name: "Laptop Charger",
                    description: "Standard laptop charger",
                    price: 29.99,
                   quantity_on_hand: 50,
                  category: "Accessories",
                  costPrice: 15,
                  warrantyInfo: "3 months warranty"
                },
                 {
                    sku: "SKU002",
                     name: "Screen Protector",
                    description: "High-quality screen protector",
                    price: 9.99,
                     quantity_on_hand: 100,
                     category: "Accessories",
                     costPrice: 5,
                     warrantyInfo: "No warranty"
               },
                  {
                    sku: "SKU003",
                     name: "USB C Cable",
                    description: "High-quality USB C Cable",
                    price: 15,
                    quantity_on_hand: 250,
                     category: "Cables",
                     costPrice: 7,
                     warrantyInfo: "No warranty"
               }
              ]);
        };

        const showNotification = (message, type = "success") => {
            setNotification({ message, type });
            setTimeout(() => setNotification(null), 3000);
        };

       const handleAddItem = async (newItemData) => {
            setIsLoadingAddItem(true);
             setInventory(prev => ([...prev, newItemData]));
            showNotification("Item added successfully!");
            setShowAddItemModal(false);
            setIsLoadingAddItem(false);
        };

         const handleAddDevice = async (newDeviceData) => {
             setIsLoadingAddItem(true);
             setDevices(prev => ([...prev, newDeviceData]));
               showNotification("Device added successfully!");
               setShowAddDeviceModal(false);
                setIsLoadingAddItem(false);
        };

        const handleEdit = (item) => {
           if(item.imei) {
                setEditItem({...item});
                 setShowEditDeviceModal(true);
            } else {
                 setEditItem({ ...item });
                setShowAddItemModal(true);
            }
        };

        const handleUpdateItem = async (updatedItem) => {
            setIsLoadingUpdate(true);
               let updateList;
               if(updatedItem.imei){
                     updateList =  devices.map(item => item.imei === updatedItem.imei ? updatedItem : item)
                    setDevices(updateList);
                } else{
                    updateList =  inventory.map(item => item.sku === updatedItem.sku ? updatedItem : item)
                     setInventory(updateList);
                }

                showNotification("Item updated successfully!");
                setEditItem(null);
                setShowEditDeviceModal(false);
                setIsLoadingUpdate(false);

        };

        const confirmDeleteItem = (itemId) => {
            if (activeList === "devices") {
                handleDeleteDevice(itemId); // Call handleDeleteDevice for devices
            } else {
                handleDeleteItem(itemId); // Call handleDeleteItem for items
            }
        };

        const handleDeleteItem = async (itemId) => {
            setIsLoadingDelete(true);
            setInventory(prev => prev.filter(item => item.sku !== itemId));
            showNotification("Item deleted successfully!");
            setDeleteItemId(null);
            setIsLoadingDelete(false);
        };

         const handleDeleteDevice = async (itemId) => {
            setIsLoadingDelete(true);
            setDevices(prev => prev.filter(item => item.imei !== itemId));
            showNotification("Device deleted successfully!");
            setDeleteItemId(null);
            setIsLoadingDelete(false);
        };


        const handleSearch = (e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
        };

        const handleFilterCategory = (e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
        };

        const handleSort = (column) => {
            if (column === sortColumn) {
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
            } else {
                setSortColumn(column);
                setSortDirection("asc");
            }
        };

        const handleExport = async (format) => {
            setIsLoadingExport(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const itemsToExport = activeList === "items" ? inventory.filter(item => selectedItems.includes(item.sku)): devices.filter(device => selectedItems.includes(device.imei))

                if (itemsToExport.length === 0) {
                    showNotification("No items selected for export!", "error");
                    return;
                }
                switch (format) {
                    case 'csv':
                        exportToCSV(itemsToExport);
                        break;
                    case 'pdf':
                        exportToPDF(itemsToExport);
                        break;
                    default:
                        showNotification(`Error exporting to ${format.toUpperCase()}!`, "error");
                }
                showNotification(`Export to ${format.toUpperCase()} completed!`);
            } catch (error) {
                showNotification(`Error exporting to ${format.toUpperCase()}!`, "error");
            } finally {
                setIsLoadingExport(false);
            }
        };

         const exportToCSV = (itemsToExport) => {
            const csvContent = [
               activeList === "items" ? [
                    "SKU",
                    "Name",
                    "Description",
                    "Price",
                    "Quantity On Hand",
                    "Category",
                    "Cost Price",
                    "Warranty Info"
                ].join(",") : [
                      "Name",
                    "Description",
                    "Price",
                    "Quantity On Hand",
                    "IMEI",
                     "Storage",
                     "Serial Number",
                     "Cost Price",
                     "Warranty Info"
               ].join(","),
                ...itemsToExport.map(item =>
                activeList === "items" ? [
                    item.sku,
                    item.name,
                    item.description,
                    item.price,
                    item.quantity_on_hand,
                    item.category,
                    item.costPrice,
                    item.warrantyInfo
                ].join(",") :  [
                      item.name,
                      item.description,
                    item.price,
                    item.quantity_on_hand,
                    item.imei,
                    item.storage,
                     item.serial_number,
                     item.costPrice,
                     item.warrantyInfo
                ].join(",")
             ),
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "inventory.csv";
            link.click();
            showNotification('CSV export completed')
        };


       const exportToPDF = (itemsToExport) => {
            const doc = new jsPDF();
            const tableColumn = activeList === "items" ? [
                "SKU",
                "Name",
                "Description",
                "Price",
                "Quantity On Hand",
                "Category",
                "Cost Price",
                "Warranty Info"
            ] : [
                "Name",
                "Description",
                "Price",
                "Quantity On Hand",
                "IMEI",
                "Storage",
                 "Serial Number",
                 "Cost Price",
                 "Warranty Info"
            ];


            const tableRows = itemsToExport.map(item =>
                activeList === "items" ? [
                    item.sku,
                    item.name,
                    item.description,
                    item.price,
                    item.quantity_on_hand,
                     item.category,
                     item.costPrice,
                     item.warrantyInfo
                ] : [
                    item.name,
                    item.description,
                    item.price,
                    item.quantity_on_hand,
                     item.imei,
                     item.storage,
                     item.serial_number,
                     item.costPrice,
                     item.warrantyInfo
                ]
            );

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 20,
            });

            doc.save('inventory.pdf');
            showNotification('PDF export completed')
        };

        const handleSelectRepair = (itemId, isSelected) => {
            if (isSelected) {
                setSelectedItems(prev => [...prev, itemId]);
            } else {
                setSelectedItems(prev => prev.filter(id => id !== itemId));
            }
        };

        const handleOpenAddItemModal = () => {
            setShowAddItemTypeModal(true);
        };


        const handleCloseAddItemTypeModal = () => {
            setShowAddItemTypeModal(false);
        };

         const handleOpenAddDeviceModal = () => {
              setShowAddDeviceModal(true);
        };

          const handleCloseAddDeviceModal = () => {
             setShowAddDeviceModal(false);
        };


        const handleCloseAddItemModal = () => {
            setShowAddItemModal(false);
        };


        const handleSaveCategory = async (category) => {
            try {
                await fetchCategories();
                showNotification("Category saved successfully!");
                setShowAddCategoryForm(false);
            } catch (err) {
                console.error("Error saving category", err);
                showNotification("Error saving category! Check the console", "error");
            }
        };

        const handleEditCategory = async (updatedCategory) => {
            try {
                if (!updatedCategory.id) {
                    throw new Error("Category ID is missing.");
                }

                await fetchCategories();
                showNotification("Category updated successfully!");
            } catch (err) {
                console.error("Error updating category", err);
                showNotification("Error updating category! Check the console", "error");
            }
        };

        const handleDeleteCategory = async (categoryName) => {
            try {
                await fetchCategories();
                showNotification("Category deleted successfully!");
            } catch (err) {
                console.error("Error deleting category", err);
                showNotification("Error deleting category! Check the console", "error");
            }
        };

        const handleOpenCategoryList = () => {
            setShowCategoryList(true);
            setShowAddCategoryForm(false);
        };

        const handleCancelCategoryList = () => {
            setShowCategoryList(false);
            setShowAddCategoryForm(false);
        };

        const handleToggleAddCategoryForm = () => {
            setShowAddCategoryForm((prev) => !prev);
        };

         const handleListChange = (listType) => {
             setActiveList(listType);
             setCurrentPage(1);
         };


        const filteredItems = inventory.filter((item) => {
            return (
                (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
                ) &&
                (filterCategory === "" || item.category === filterCategory)
            );
        });
        const filteredDevices = devices.filter((item) => {
            return (
                 (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.imei.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     item.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
                )
             );
        });

        const sortedItems = [...filteredItems].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];
            if (aValue < bValue) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === "asc" ? 1 : -1;
            }
            return 0;
        });
          const sortedDevices = [...filteredDevices].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];
            if (aValue < bValue) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === "asc" ? 1 : -1;
            }
            return 0;
        });

        const paginatedItems = sortedItems.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
          const paginatedDevices = sortedDevices.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
         const filteredPaginatedInventory = activeList === "items" ? paginatedItems : paginatedDevices;

        return (
            <div className="p-4 relative">
                {(isLoadingAddItem || isLoadingDelete || isLoadingUpdate || isLoadingExport) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
                            <Loading className="animate-spin" isLoading={true}/>
                            <span>Processing...</span>
                        </div>
                    </div>
                )}
                {notification && (
                    <Alert className={`mb-4 ${notification.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
                        <AlertCircle className={notification.type === 'error' ? 'text-red-500' : 'text-green-500'} />
                        <AlertDescription>{notification.message}</AlertDescription>
                    </Alert>
                )}
                <h1 className="text-2xl font-bold mb-4">Inventory</h1>
                 <div className="mb-4 flex gap-2">
                    <button
                         onClick={() => handleListChange("items")}
                          className={`${activeList === "items" ? "bg-gray-200" : "bg-gray-100"} text-gray-700 px-4 py-2 rounded `}
                      >
                         Items
                     </button>
                      <button
                        onClick={() => handleListChange("devices")}
                       className={`${activeList === "devices" ? "bg-gray-200" : "bg-gray-100"} text-gray-700 px-4 py-2 rounded `}
                      >
                           Devices
                       </button>
                </div>
                {/* Search and Filter */}
               <div className="flex mb-4">
                    <input
                        type="text"
                         placeholder={activeList === "items" ? "Search by Item Name or SKU" : "Search by Device Name, IMEI or Serial Number"}
                        value={searchTerm}
                        onChange={handleSearch}
                         className="input-premium mr-2 rounded w-full"
                        aria-label="Search items"
                    />
                     {activeList === "items" && (
                        <select
                            value={filterCategory}
                            onChange={handleFilterCategory}
                           className="select-premium rounded"
                             aria-label="Filter by category"
                        >
                           <option value="">All Categories</option>
                            {categories.map((category) => (
                               <option key={category.id} value={category.name}>{category.name}</option>
                             ))}
                        </select>
                     )}
                </div>

                {/* Pagination Info */}
               <div className="mb-4">
                    <span className="text-sm text-gray-600">
                        Showing page {currentPage} of {Math.ceil(filteredPaginatedInventory.length / itemsPerPage)}
                        ({filteredPaginatedInventory.length} total records)
                    </span>
                </div>
                {/* Inventory List */}
                   {activeList === "items" ? (
                        <ItemList
                            inventory={filteredPaginatedInventory}
                             onPageChange={setCurrentPage}
                            onDelete={confirmDeleteItem}
                            onEditItem={handleEdit}
                             onSort={handleSort}
                       />
                     ) : (
                       <DeviceList
                            devices={filteredPaginatedInventory}
                            onPageChange={setCurrentPage}
                            onDelete={confirmDeleteItem}
                             onEditItem={handleEdit}
                             onSort={handleSort}
                        />
                    )}

                {/* Export Buttons */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleExport("csv")}
                             className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                            aria-label="Export to CSV"
                        >
                            <Download size={16} />
                            <span>CSV</span>
                        </button>
                        <button
                            onClick={() => handleExport("pdf")}
                             className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                             aria-label="Export to PDF"
                        >
                            <File size={16} />
                            <span>PDF</span>
                        </button>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                            aria-label="Previous Page"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(
                                        prev + 1,
                                        Math.ceil(filteredPaginatedInventory.length / itemsPerPage)
                                    )
                                )
                            }
                            disabled={currentPage >= Math.ceil(filteredPaginatedInventory.length / itemsPerPage)}
                             className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                            aria-label="Next Page"
                        >
                            Next
                        </button>
                    </div>
                </div>

                    {/* Add Purchase Order Button */}
                  <div className="flex items-center mb-4 space-x-2">
                     <button
                        onClick={handleOpenAddItemModal}
                         className="bg-green-500 text-white px-4 py-2 rounded"
                        aria-label="Add New Item"
                    >
                        Add Item
                     </button>
                        <button
                        onClick={handleOpenCategoryList}
                         className="bg-purple-500 text-white px-4 py-2 rounded"
                        aria-label="View Categories"
                    >
                        View Categories
                    </button>
                  </div>

                {/* Modals */}
                  <AddItemTypeModal
                    isOpen={showAddItemTypeModal}
                    onClose={handleCloseAddItemTypeModal}
                    onSelectItem={() => {
                       setShowAddItemTypeModal(false);
                       setEditItem(null);
                       setShowAddItemModal(true);
                   }}
                     onSelectDevice={() => {
                         setShowAddItemTypeModal(false);
                         setEditItem(null);
                        setShowAddDeviceModal(true);
                   }}
               />
                 {showAddDeviceModal && (
                    <AddDeviceModal
                            isOpen={showAddDeviceModal}
                             onClose={handleCloseAddDeviceModal}
                            onSave={handleAddDevice}
                        />
                    )}
                {showAddItemModal && (
                    <div className="modal-premium">
                        <div className="modal-content-premium">
                            <h2 className="text-xl font-semibold mb-4">
                                {editItem ? "Edit Item" : "Add Item"}
                            </h2>
                            <ItemForm
                                onSave={editItem ? handleUpdateItem : handleAddItem}
                                onClose={handleCloseAddItemModal}
                                initialItem={editItem}
                            />
                             <button onClick={handleCloseAddItemModal} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">Cancel</button>
                        </div>
                    </div>
                )}
                <DeleteInventoryModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={() => {
            if (activeList === "devices") {
                handleDeleteDevice(deleteItemId); // Call handleDeleteDevice for devices
            } else {
                handleDeleteItem(deleteItemId); // Call handleDeleteItem for items
            }
        }}
        itemId={deleteItemId}
        isDevice={activeList === "devices"} // Pass isDevice prop
    />
                  {showEditDeviceModal && (
                     <EditDeviceModal
                         isOpen={showEditDeviceModal}
                         onClose={() => setShowEditDeviceModal(null)}
                         onSave={handleUpdateItem}
                         initialItem={editItem}
                      />
                 )}
                <ViewCategoriesModal
                    isOpen={showCategoryList}
                    onClose={handleCancelCategoryList}
                    categories={categories}
                    showAddCategoryForm={showAddCategoryForm}
                    onToggleAddCategoryForm={handleToggleAddCategoryForm}
                    onSaveCategory={handleSaveCategory}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={handleDeleteCategory}
                />
            </div>
        );
    };

    export default InventoryEntry;
