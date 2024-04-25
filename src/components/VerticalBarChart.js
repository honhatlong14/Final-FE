import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const VerticalBarChart = ({ data }) => {
    // Tạo mảng các ngày
    const dates = data.map(item => item.DateTime);

    // Tạo mảng các BookId
    const bookIds = data
        .flatMap(item => item.BookDataInfo.map(info => info.BookId ))
        .filter((value, index, self) => self.indexOf(value) === index);

    // const dataBooks = data.map((item) =>
    //     item.BookDataInfo.map((bookInfo) => ({
    //         BookId: bookInfo.BookId,
    //         BookTitle: bookInfo.BookTitle,
    //     }))
    // );
    //
    // const flattenedResult = [].concat(...dataBooks);
    const uniqueBookIds = new Set();

    const resultArray = data.map((item) =>
        item.BookDataInfo
            .filter((bookInfo) => {
                if (!uniqueBookIds.has(bookInfo.BookId)) {
                    uniqueBookIds.add(bookInfo.BookId);
                    return true;
                }
                return false;
            })
            .map((bookInfo) => ({
                BookId: bookInfo.BookId,
                BookTitle: bookInfo.BookTitle,
            }))
    );
    const flattenedResult = [].concat(...resultArray);

    // Tạo một đối tượng chứa dữ liệu biểu đồ
    const chartData = {
        labels: dates,
        datasets: flattenedResult.map(book => ({
            label: book.BookTitle,
            data: data.map(item => {
                const bookData = item.BookDataInfo.find(info => info.BookId === book.BookId);
                return bookData ? bookData.TotalProfit : 0;
            }),
            backgroundColor: getRandomColor(), // Hàm để tạo màu ngẫu nhiên
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1,
        })),
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Total Profit($)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date time',
                },
            },
        },
    };

    return (
        <div className='h-full w-full'>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default VerticalBarChart;
