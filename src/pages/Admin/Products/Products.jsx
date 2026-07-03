import { useState, useMemo } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/formatters";
import "./Products.css";

function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useCart();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    oldPrice: "",
    image: "",
    rating: 4.5,
    sold: 0,
    stock: 0,
    category: "ao",
    brand: "",
    featured: false,
    shopId: "",
    sizes: "",
    colors: "",
    description: "",
    sizePrices: "",
  });

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const keyword = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.brand.toLowerCase().includes(keyword)
    );
  }, [products, search]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice || "",
        image: product.image,
        rating: product.rating,
        sold: product.sold,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
        featured: product.featured || false,
        shopId: product.shop?.id || "",
        sizes: product.sizes?.join(", ") || "",
        colors: product.colors?.join(", ") || "",
        description: product.description || "",
        sizePrices: product.sizePrices 
          ? Object.entries(product.sizePrices)
              .map(([size, price]) => `${size}:${price}`)
              .join(", ")
          : "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        oldPrice: "",
        image: "",
        rating: 4.5,
        sold: 0,
        stock: 0,
        category: "ao",
        brand: "",
        featured: false,
        shopId: "",
        sizes: "",
        colors: "",
        description: "",
        sizePrices: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse sizePrices from format "S:100000, M:110000, L:120000"
    const sizePricesObj = {};
    if (formData.sizePrices) {
      formData.sizePrices.split(",").forEach((item) => {
        const [size, price] = item.split(":").map((s) => s.trim());
        if (size && price && !isNaN(Number(price))) {
          sizePricesObj[size] = Number(price);
        }
      });
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      rating: Number(formData.rating),
      sold: Number(formData.sold),
      stock: Number(formData.stock),
      sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: formData.colors.split(",").map((c) => c.trim()).filter(Boolean),
      sizePrices: Object.keys(sizePricesObj).length > 0 ? sizePricesObj : undefined,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Quản lý sản phẩm</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <FaPlus />
          Thêm sản phẩm
        </button>
      </div>

      <div className="products-search">
        <FaSearch />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Đã bán</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.name} className="product-thumb" />
                </td>
                <td>
                  <div className="product-name">{product.name}</div>
                  {product.featured && <span className="badge-featured">Nổi bật</span>}
                </td>
                <td>{product.brand}</td>
                <td>
                  <span className={`category-badge ${product.category}`}>
                    {product.category === "ao" ? "Áo" : product.category === "quan" ? "Quần" : "Giày"}
                  </span>
                </td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.stock}</td>
                <td>{product.sold}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleOpenModal(product)}
                      title="Sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Thương hiệu *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Giá *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Giá cũ</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>URL hình ảnh *</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="ao">Áo</option>
                    <option value="quan">Quần</option>
                    <option value="giay">Giày</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tồn kho *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Đã bán</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sold}
                    onChange={(e) => setFormData({ ...formData, sold: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Đánh giá</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Sizes (ngăn cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Màu sắc (ngăn cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="Đen, Trắng, Xám"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Giá theo size (format: S:100000, M:110000, L:120000)</label>
                  <input
                    type="text"
                    placeholder="S:100000, M:110000, L:120000"
                    value={formData.sizePrices}
                    onChange={(e) => setFormData({ ...formData, sizePrices: e.target.value })}
                  />
                  <small style={{ color: "#666", fontSize: "12px" }}>
                    Để trống nếu tất cả size có cùng giá. Format: size:giá, cách nhau bằng dấu phẩy
                  </small>
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    Sản phẩm nổi bật
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
