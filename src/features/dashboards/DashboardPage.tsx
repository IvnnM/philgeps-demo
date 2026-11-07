import RoleSwitcher from '../../demo/RoleSwitcher';

export default function DashboardPage() {
  return (
    <div className="text-center">
      <h1>Dashboard</h1>
      <p>Main dashboard (Super Admin / Office Admin)</p>
      <RoleSwitcher />
    </div>
  );
}
