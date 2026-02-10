import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../layout/MainLayout';
import { ProductList } from '../features/products/components/ProductList';
import WishlistPage from '../features/wishlist/components/WishlistPage';
import { AdminDashboard } from '../pages/AdminDashboard';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { InventoryDashboard } from '../features/provider/components/InventoryDashboard';
import { StoreList } from '../features/stores/components/StoreList';
import { PerfilUser } from '../pages/PerfilUser';
import { ForgotPassword } from '../features/auth/components/ForgotPassword';
import { ResetPasswordConfirm } from '../features/auth/components/ResetPasswordConfirm';
import { ProductDetailWrapper } from '../features/products/components/ProductDetailWrapper';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginForm />} />

                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />



                <Route element={<MainLayout />}>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/componente/:id" element={<ProductDetailWrapper />} />

                    <Route path='/stores' element={<StoreList />} />

                    <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/perfil-user" element={<PerfilUser />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['proveedor']} />}>
                        <Route path="/inventory" element={<InventoryDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};