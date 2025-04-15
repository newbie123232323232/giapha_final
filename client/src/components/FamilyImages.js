import React, { useEffect, useState } from "react";
import "./FamilyImages.css";

const LOCAL_KEY = "family_docs";

const FamilyImages = () => {
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ name: "", path: "", description: "", type: "image" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const availableFiles = [
    "image1.jpg",
    "image2.jpg",
    "document1.pdf",
    "document2.pdf",
  ];

  useEffect(() => {
    fetch("/data/FamilyImages.json")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
        setIsLoading(false);
      })
      .catch(() => {
        const fallback = availableFiles.map((file) => ({
          name: file,
          path: `/Tailieu/${file}`,
          description: "",
          type: file.endsWith(".jpg") ? "image" : "document",
          dateAdded: new Date().toISOString()
        }));
        setFiles(fallback);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(fallback));
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.path) return alert("Vui lòng nhập đầy đủ thông tin");

    const newList = [...files];
    if (editingIndex !== null) {
      const oldDate = newList[editingIndex].dateAdded;
      newList[editingIndex] = { ...form, dateAdded: oldDate };
    } else {
      newList.push({ ...form, dateAdded: new Date().toISOString() });
    }

    setFiles(newList);
    setForm({ name: "", path: "", description: "", type: "image" });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setForm(files[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này?")) {
      const newList = files.filter((_, i) => i !== index);
      setFiles(newList);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const filePath = URL.createObjectURL(file);
      setForm({ ...form, path: filePath, type: "image" });
    }
  };

  const filteredFiles = files
    .filter((item) => {
      const searchLower = searchTerm.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const timeA = new Date(a.dateAdded).getTime();
      const timeB = new Date(b.dateAdded).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

  if (isLoading) {
    return (
      <div className="family-image-loading">
        <div className="spinner-border text-primary family-image-loading-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="family-images-container">
      <div className="family-images-header">
        <h2 className="family-images-title">Tài liệu gia đình</h2>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-primary family-image-btn family-image-btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setForm({ name: "", path: "", description: "", type: "image" });
              setEditingIndex(null);
            }}
          >
            {showForm ? "Đóng form" : "Thêm tài liệu"}
          </button>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="form-select"
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="family-image-form">
          <h3 className="family-image-form-title">
            {editingIndex !== null ? "Sửa tài liệu" : "Thêm tài liệu mới"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="family-image-form-group">
              <label className="family-image-form-label">Tên tài liệu</label>
              <input
                type="text"
                className="form-control family-image-form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="family-image-form-group">
              <label className="family-image-form-label">Loại tài liệu</label>
              <select
                className="form-select family-image-form-control"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="image">Ảnh</option>
                <option value="document">Tài liệu</option>
              </select>
            </div>

            <div className="family-image-form-group">
              <label className="family-image-form-label">Tải lên file</label>
              <input
                type="file"
                className="form-control family-image-form-control"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>

            <div className="family-image-form-group">
              <label className="family-image-form-label">Mô tả</label>
              <textarea
                className="form-control family-image-form-control"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary family-image-btn family-image-btn-primary">
                {editingIndex !== null ? "Lưu" : "Thêm"}
              </button>
              <button
                type="button"
                className="btn btn-secondary family-image-btn"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="alert alert-warning family-image-alert family-image-alert-warning">
          {error}
        </div>
      )}

      <div className="family-images-grid">
        {filteredFiles.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info family-image-alert family-image-alert-info">
              {searchTerm
                ? `Không tìm thấy tài liệu nào phù hợp với từ khóa "${searchTerm}"`
                : "Chưa có tài liệu nào."}
            </div>
          </div>
        ) : (
          filteredFiles.map((item, index) => (
            <div key={index} className="family-image-card">
              <div className="family-image-card-body">
                <h5 className="family-image-card-title">{item.name}</h5>
                {item.type === "image" ? (
                  <img
                    src={item.path}
                    alt={item.name}
                    className="family-image-card-img"
                  />
                ) : (
                  <div className="text-center">
                    <i className="bi bi-file-earmark-text" style={{ fontSize: "48px" }}></i>
                  </div>
                )}
                <p className="family-image-card-description">{item.description}</p>
                <div className="text-muted small">
                  Ngày thêm: {new Date(item.dateAdded).toLocaleDateString()}
                </div>
              </div>
              <div className="family-image-card-footer">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEdit(index)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(index)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FamilyImages;
