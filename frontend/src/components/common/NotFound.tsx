export default function NotFound() {
    return (
      <>
        <div className="container">
          <div className="error-code">404</div>
          <div className="error-message">Page Not Found</div>
          <p>죄송합니다, 해당 페이지는 찾을 수 없습니다. </p>
          <a href="/" className="back-link">
            이전화면으로
          </a>
        </div>
        <style>
          {`
          header {
            display: none;
          }

          footer {
            display: none;
          }

          main {
            min-height: 0px !important; 
          }

          body {
            font-family: 'Arial', sans-serif;
            color: #ecf0f1;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            height: 100vh;
            justify-content: center;
        }

        .container {
            text-align: center;
        }

        .error-code {
            font-size: 120px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 10px;
        }

        .error-message {
            font-size: 24px;
            color: #e74c3c;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            color: #bdc3c7;
            margin-bottom: 30px;
        }

        .back-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: #ecf0f1;
            text-decoration: none;
            border-radius: 5px;
            font-size: 18px;
            transition: background-color 0.3s;
        }

        .back-link:hover {
            background-color: #2980b9;
        }
        `}</style>
      </>
    )
}