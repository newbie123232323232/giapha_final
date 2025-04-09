import { useState, useEffect } from 'react'; // 🟡 Thêm useState, useEffect
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { changePassword, deleteAccount, getUserProfile } from '../services/authService'; // 🟡 Thêm getUserProfile
import { getToken, removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [initialValues, setInitialValues] = useState({
    oldPassword: '',
    newPassword: '',
    HoTen: '',
    Email: '',
    NgaySinh: '',
    GioiTinh: '',
    Avatar: '',
  }); // 🟡 Thêm state cho initialValues

  // 🟡 Lấy thông tin user khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(token);
        setInitialValues({
          oldPassword: '',
          newPassword: '',
          HoTen: data.HoTen || '',
          Email: data.Email || '',
          NgaySinh: data.NgaySinh ? data.NgaySinh.split('T')[0] : '', // format YYYY-MM-DD
          GioiTinh: data.GioiTinh || '',
          Avatar: data.Avatar || '',
        });
      } catch (err) {
        console.error('Lỗi khi lấy profile:', err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleDelete = async () => {
    if (window.confirm('Bạn chắc chắn muốn xóa tài khoản?')) {
      await deleteAccount(token);
      removeToken();
      navigate('/login');
    }
  };

  return (
    <div className="container">
      <h2>Đổi mật khẩu & Thông tin cá nhân</h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize // 🟡 Cho phép cập nhật initialValues khi state thay đổi
        validationSchema={Yup.object({
          oldPassword: Yup.string().required('Bắt buộc'),
          newPassword: Yup.string().min(6, 'Tối thiểu 6 ký tự').required('Bắt buộc'),
          HoTen: Yup.string().required('Bắt buộc'),
          Email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
          NgaySinh: Yup.date().nullable().typeError('Ngày sinh không hợp lệ'),
          GioiTinh: Yup.string().oneOf(['Nam', 'Nữ', 'Khác'], 'Giới tính không hợp lệ'),
          Avatar: Yup.string().url('Avatar phải là URL hợp lệ'),
        })}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await changePassword(values, token);
            setStatus('Cập nhật thành công!');
          } catch (err) {
            setStatus(err.response?.data?.message || 'Thất bại!');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            {/* Mật khẩu */}
            <div className="mb-3">
              <label>Mật khẩu cũ</label>
              <Field name="oldPassword" type="password" className="form-control" />
              <ErrorMessage name="oldPassword" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Mật khẩu mới</label>
              <Field name="newPassword" type="password" className="form-control" />
              <ErrorMessage name="newPassword" component="div" className="text-danger" />
            </div>

            {/* Thông tin cá nhân */}
            <div className="mb-3">
              <label>Họ tên</label>
              <Field name="HoTen" className="form-control" />
              <ErrorMessage name="HoTen" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <Field name="Email" type="email" className="form-control" />
              <ErrorMessage name="Email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Ngày sinh</label>
              <Field name="NgaySinh" type="date" className="form-control" />
              <ErrorMessage name="NgaySinh" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Giới tính</label>
              <Field as="select" name="GioiTinh" className="form-control">
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </Field>
              <ErrorMessage name="GioiTinh" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label>Avatar (URL)</label>
              <Field name="Avatar" className="form-control" />
              <ErrorMessage name="Avatar" component="div" className="text-danger" />
            </div>

            {/* Status và nút */}
            {status && <div className="mb-2 text-info">{status}</div>}
            <button type="submit" className="btn btn-warning me-2" disabled={isSubmitting}>
              Cập nhật
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Xóa tài khoản
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Profile;
