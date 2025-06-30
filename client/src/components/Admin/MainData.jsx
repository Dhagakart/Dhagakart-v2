import { useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Doughnut, Line, Pie, Bar } from 'react-chartjs-2';
import { useSelector, useDispatch } from 'react-redux';
import { getAdminProducts } from '../../actions/productAction';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';

const StatCard = ({ title, value, icon }) => (
  <div className="flex items-center gap-4 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 bg-[#F5F6F5] text-[#003366]">
    <div className="text-2xl text-[#004080]">{icon}</div>
    <div>
      <h4 className="text-sm font-medium text-[#0059B3]">{title}</h4>
      <h2 className="text-xl font-semibold">{value}</h2>
    </div>
  </div>
);

const ChartContainer = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-semibold text-[#003366] mb-4 text-center">{title}</h3>
    {children}
  </div>
);

const MainData = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.users);

  const outOfStock = products?.reduce((count, item) => count + (item.stock === 0 ? 1 : 0), 0);
  const totalAmount = orders?.reduce((total, order) => total + order.totalPrice, 0) || 0;

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();

  const lineState = {
    labels: months,
    datasets: [
      {
        label: `Sales ${currentYear - 2}`,
        borderColor: '#0059B3',
        backgroundColor: '#0059B3',
        data: months.map((_, i) =>
          orders?.filter(
            (od) => new Date(od.createdAt).getMonth() === i && new Date(od.createdAt).getFullYear() === currentYear - 2
          ).reduce((total, od) => total + od.totalPrice, 0)
        ),
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: `Sales ${currentYear - 1}`,
        borderColor: '#003366',
        backgroundColor: '#003366',
        data: months.map((_, i) =>
          orders?.filter(
            (od) => new Date(od.createdAt).getMonth() === i && new Date(od.createdAt).getFullYear() === currentYear - 1
          ).reduce((total, od) => total + od.totalPrice, 0)
        ),
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: `Sales ${currentYear}`,
        borderColor: '#004080',
        backgroundColor: '#004080',
        data: months.map((_, i) =>
          orders?.filter(
            (od) => new Date(od.createdAt).getMonth() === i && new Date(od.createdAt).getFullYear() === currentYear
          ).reduce((total, od) => total + od.totalPrice, 0)
        ),
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const statuses = ['Processing', 'Shipped', 'Delivered'];
  const pieState = {
    labels: statuses,
    datasets: [
      {
        backgroundColor: ['#0059B3', '#003366', '#004080'],
        hoverBackgroundColor: ['#003087', '#002244', '#002E5C'],
        data: statuses.map((status) => orders?.filter((item) => item.orderStatus === status).length),
      },
    ],
  };

  const doughnutState = {
    labels: ['Out of Stock', 'In Stock'],
    datasets: [
      {
        backgroundColor: ['#0059B3', '#003366'],
        hoverBackgroundColor: ['#003087', '#002244'],
        data: [outOfStock, products?.length - outOfStock],
      },
    ],
  };

  const barState = {
    labels: categories,
    datasets: [
      {
        label: 'Products',
        borderColor: '#003366',
        backgroundColor: '#003366',
        hoverBackgroundColor: '#002244',
        data: categories.map((cat) => products?.filter((item) => item.category === cat).length),
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 20, padding: 15, color: '#003366' },
      },
    },
    scales: {
      x: { ticks: { color: '#003366' } },
      y: { ticks: { color: '#003366' }, beginAtZero: true },
    },
  };

  return (
    <>
      <MetaData title="Admin Dashboard | DhagaKart" />
      <div className="w-full mx-auto space-y-8">
        <h1 className="text-2xl font-semibold text-[#003366]">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Sales Amount"
            value={`₹${totalAmount.toLocaleString()}`}
            icon={<i className="fas fa-rupee-sign" />}
          />
          <StatCard
            title="Total Orders"
            value={orders?.length || 0}
            icon={<i className="fas fa-shopping-cart" />}
          />
          <StatCard
            title="Total Products"
            value={products?.length || 0}
            icon={<i className="fas fa-box" />}
          />
          <StatCard
            title="Total Users"
            value={users?.length || 0}
            icon={<i className="fas fa-users" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Sales Performance">
            <div className="h-80">
              <Line data={lineState} options={chartOptions} />
            </div>
          </ChartContainer>
          <ChartContainer title="Order Status Distribution">
            <div className="h-80">
              <Pie data={pieState} options={chartOptions} />
            </div>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Product Categories">
            <div className="h-80">
              <Bar data={barState} options={chartOptions} />
            </div>
          </ChartContainer>
          <ChartContainer title="Stock Status">
            <div className="h-80">
              <Doughnut data={doughnutState} options={chartOptions} />
            </div>
          </ChartContainer>
        </div>
      </div>
    </>
  );
};

export default MainData;