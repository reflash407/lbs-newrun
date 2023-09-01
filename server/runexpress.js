import express from "express"
import mysql from "mysql"
import bodyParser from "body-parser"
import moment from 'moment';
import { createCanvas, loadImage } from 'canvas';
import fs from "fs"


const app = express()
const port = 3010


//mysql 연결설정
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'rundb'
})


// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패: ', err);
    return;
  }
  console.log('db연결 완료');
});

//bodyParser사용
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('뉴런')
})

app.listen(port, () => {
  console.log(`서버 실행됨 (port ${port})`)
})




//회원가입_소셜아니고 그냥 회원가입
app.post('/join', (req, res) => {
  const { email, username, nickname, password, goal_distance } = req.body; // POST 요청에서 사용자 정보 가져오기

  // 중복된 이메일 체크하는 쿼리문
  const checkDuplicateQuery = 'SELECT * FROM users WHERE email = ?';

  // 사용자 정보를 users 테이블에 삽입하는 쿼리문
  const insertUserQuery = 'INSERT INTO users (email, username, nickname, password, goal_distance) VALUES (?, ?, ?, ?, ?)';

  // 중복된 이메일 체크
  db.query(checkDuplicateQuery, [email], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      res.status(409).json({ error: '이메일 중복' }); // 중복된 ID가 있을 경우 오류 응답
      return;
    }

    // 사용자 정보 삽입
    db.query(insertUserQuery, [email, username, nickname, password, goal_distance], (err) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.status(200).json({ message: '가입성공' }); // 회원가입 성공 응답
    });
  });
});




//email, username, nickname, password, user_picture, goal_distance, crew_id
//회원가입_소셜 회원가입
app.post('/sns_join', (req, res) => {
  const { email, username, nickname, goal_distance } = req.body; // POST 요청에서 사용자 정보 가져오기

  // 중복된 이메일 체크하는 쿼리문
  const checkDuplicateQuery = 'SELECT * FROM users WHERE email = ?';

  // 사용자 정보를 users 테이블에 삽입하는 쿼리문
  const insertUserQuery = 'INSERT INTO users (email, username, nickname, goal_distance) VALUES (?, ?, ?, ?)';

  // 중복된 이메일 체크
  db.query(checkDuplicateQuery, [email], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      res.status(409).json({ error: '이메일 중복' }); // 중복된 ID가 있을 경우 오류 응답
      return;
    }

    // 사용자 정보 삽입
    db.query(insertUserQuery, [email, username, nickname, goal_distance], (err) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.status(200).json({ message: '가입성공' }); // 회원가입 성공 응답
    });
  });
});


// 로그인
app.post('/login', (req, res) => {
  const { email, password } = req.body; // POST 요청에서 사용자 ID와 비밀번호 가져오기

  // 사용자 정보를 users 테이블에서 조회하는 쿼리문
  const selectUserQuery = 'SELECT * FROM users WHERE email = ?';

  // 사용자 정보 조회
  db.query(selectUserQuery, [email], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: '없는이메일입니다' }); // 존재하지 않는 이메일일 경우 오류 응답
      return;
    }

    const user = results[0];
    if (user.password !== password) {
      res.status(401).json({ error: '비밀번호틀림' }); // 비밀번호 불일치 경우 오류 응답
      return;
    }

    res.status(200).json({ message: '로그인성공' }); // 로그인 성공 응답
  });
});


// sns_로그인
app.post('/sns_login', (req, res) => {
  const email = req.body.email;

  // 사용자 정보를 users 테이블에서 조회하는 쿼리문
  const selectUserQuery = `SELECT * FROM users WHERE email = ?`;

  // 사용자 정보 조회
  db.query(selectUserQuery, [email], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: '없는이메일입니다' }); // 존재하지 않는 ID일 경우 오류 응답
      return;
    }

    res.status(200).json({ message: '로그인성공' }); // 로그인 성공 응답
  });
});


// 달린기록 저장
app.post('/run', (req, res) => {
  const { distance, speed, run_time, route, u_email } = req.body;
  const date = moment().format('YYYY-MM-DD HH:mm:ss');
	
// run_record 테이블에 데이터 삽입
  const insertQuery = `
    INSERT INTO run_record (date, distance, speed, run_time, route, u_email)
    VALUES (?, ?, ?, ?, ST_GeomFromText(?), ?)
  `;
	
	const lineroute = `LINESTRING${route}`;
  const rundata = [date, distance, speed, run_time, lineroute, u_email];
  db.query(insertQuery, rundata, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Failed to record run data' });
      return;
    }

    res.status(200).json({ message: 'Run data recorded successfully' });
  });
});



//전체달린거리, 이주의 달린거리, 이달의 달린거리
app.post('/record', (req, res) => {
  const u_email = req.body.email

   // 달린 거리 합계를 계산하는 쿼리
  const totalDistanceQuery = `
    SELECT SUM(distance) AS totalDistance
    FROM run_record
    WHERE u_email = ?
  `;

  // 해당 월의 달린 거리 합계를 계산하는 쿼리
  const monthlyDistanceQuery = `
    SELECT SUM(distance) AS monthlyDistance
    FROM run_record
    WHERE u_email = ?
      AND YEAR(date) = YEAR(CURRENT_DATE())
      AND MONTH(date) = MONTH(CURRENT_DATE())
  `;

  // 해당 주의 달린 거리 합계를 계산하는 쿼리
  const weeklyDistanceQuery = `
    SELECT SUM(distance) AS weeklyDistance
    FROM run_record
    WHERE u_email = ?
      AND YEAR(date) = YEAR(CURRENT_DATE())
      AND WEEK(date) = WEEK(CURRENT_DATE())
  `;
	
	
  // 총 달린 거리 합계
  db.query(totalDistanceQuery, [u_email], (err, totalResult) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Failed to fetch user information' });
      return;
    }

	// 해당 월의 달린 거리 합계
    db.query(monthlyDistanceQuery, [u_email], (err, monthResult) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Failed to fetch user information' });
        return;
      }
	
	  // 해당 주의 달린 거리 합계
      db.query(weeklyDistanceQuery, [u_email], (err, weekResult) => {
        if (err) {
          console.error('Error executing MySQL query: ', err);
          res.status(500).json({ error: 'Failed to fetch user information' });
          return;
        }

        const runrecord = {
          totalDistance: totalResult[0].totalDistance || 0,
          monthlyDistance: monthResult[0].monthlyDistance || 0,
          weeklyDistance: weekResult[0].weeklyDistance || 0,
        };

        res.json(runrecord);	  
      });
    });
  });
});


//유저 정보 가져오기
app.post('/user', (req, res) => {
  const email = req.body.email;

  // 사용자 정보를 가져오는 쿼리
  const query = `
    SELECT email, username, nickname, user_picture, goal_distance, crew_id
    FROM users
    WHERE email = ?
  `;

  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error fetching user information:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const userData = results[0];
        res.json(userData);
      }
    }
  });
});



//일주일 달린거리 합, 평균 속도 보내주기
//dis_run_aver_sp
app.post('/dis_run_aver_sp', (req, res) => {
  const u_email = req.body.email;

// 일주일간 운동 거리 합 조회 쿼리
  const distance = `
    SELECT SUM(distance) as totalDistance
    FROM run_record
    WHERE u_email = ?
      AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
  `;

  // 일주일간 운동 속도 평균 조회 쿼리
  const speed = `
    SELECT AVG(speed) AS avgSpeed
    FROM run_record
    WHERE u_email = ?
      AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
  `;

    // 일주일간 운동 거리 합 조회
    db.query(distance, [u_email], (err, distanceResult) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Failed to fetch total distance' });
        return;
      }

      // 일주일간 운동 속도 평균 조회
      db.query(speed, [u_email], (err, speedResult) => {
        if (err) {
          console.error('Error executing MySQL query: ', err);
          res.status(500).json({ error: 'Failed to fetch average speed' });
          return;
        }
		  
		//보낼 데이터
        const dis_sped = {
        totalDistance: distanceResult[0].totalDistance || 0,
        avgSpeed: speedResult[0].avgSpeed || 0,
        };

        res.json(dis_sped);
      });
	});
});



//사용자 모든 달리기 기록 뽑아오기
app.post('/all_run_record', (req, res) => {
  const u_email = req.body.email;

  // 사용자의 모든 달린 기록을 가져오는 쿼리
  const query = `
    SELECT *
    FROM run_record
    WHERE u_email = ?
	ORDER BY date DESC
  `;

  db.query(query, [u_email], (error, results) => {
    if (error) {
      console.error('Error fetching user records:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});



//탑 10정보 불러오기
app.get('/top10_record', (req, res) => {
	
// 일주일간 운동 속도 평균 조회 쿼리
  const toplist = `
	SELECT users.username, users.nickname, SUM(run_record.distance) AS totalDistance
	FROM users
	INNER JOIN run_record ON users.email = run_record.u_email
	WHERE run_record.date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
	GROUP BY users.email
	ORDER BY totalDistance DESC
	LIMIT 10;
  `;
	
		  
	db.query(toplist, (err, toplistResult)=> {
		if(err) {
			console.error('Error executing MySQL query: ', err);
			res.status(500).json({ error: 'Failed to fetch average speed' });
			return;
		}
        res.json(toplistResult);
	});
});




//-------------------캔버스--------------------------------------------



//최대최소 구하는 함수?
function findMinMaxCoordinates(routeData) {
  let minX = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;

  for (let i = 0; i < routeData.length; i++) {
    const { x, y } = routeData[i];

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return { minX, maxX, minY, maxY };
}


// route 데이터를 사용하여 이미지 생성하는 함수
function generateImageFromRoute(routeData) {
  return new Promise((resolve, reject) => {
    
	  // routeData에서 x와 y 좌표의 최대 및 최소 값을 구함
	  const { minX, maxX, minY, maxY } = findMinMaxCoordinates(routeData);

	  const difX = maxX - minX;
	  const difY = maxY - minY;

	  console.log("x좌표의 차이"+difX.toFixed(6));
	  console.log("y좌표의 차이"+difY.toFixed(6));
	  
	  const scalex = 1080/(difX.toFixed(6));
	  const scaley = 720/(difY.toFixed(6));
	  
	  // Canvas 생성
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
	  //console.log(routeData);
	  
    // 경로 그리기
	ctx.strokeStyle = '#000000'; //검정
    //ctx.strokeStyle = '#4D60FF'; //파랑
    ctx.lineWidth = 20;

    ctx.beginPath();
    for (let i = 0; i < routeData.length; i++) {
      const { x, y } = routeData[i];
		
	  // 좌표 값 조정 또는 스케일링 작업 등을 수행
      const adjustedX = (x-minX) * scalex;
      const adjustedY = (y-minY) * scaley;
	  
	  console.log(adjustedX.toFixed(6));
	  console.log(adjustedY.toFixed(6));
		
      if (i === 0) {
        ctx.moveTo(adjustedX, adjustedY);
      } else {
        ctx.lineTo(adjustedX, adjustedY);
      }
    }
    ctx.stroke();

    // 이미지 생성 완료
    resolve(canvas);
  });
}


// 이미지 생성 및 저장 라우트 핸들러
app.post('/image_make', (req, res) => {
  
	// POST 요청에서 사용자 id 추출
  const id = req.body.id; 

  // MySQL 쿼리 실행 - route 데이터 조회
	const sql = `SELECT route FROM run_record WHERE id = ?`;
	
  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Error retrieving route data:', error);
      res.status(500).json({ error: 'Failed to retrieve route data' });
      return;
    }
	
	  
	 //res.json(results);

    // 결과 확인
    if (results.length === 0) {
      res.status(404).json({ error: 'Route data not found' });
      return;
    }

    // route 데이터 가져오기
    const routeData = results[0].route;

    // 이미지 생성
    generateImageFromRoute(routeData)
      .then((image) => {
    	const imageBuffer = image.toBuffer(); // 이미지를 버퍼로 변환
    	const imageBase64 = imageBuffer.toString('base64'); // 이미지를 Base64로 인코딩

		// JSON 객체 생성
  		const imageData = {
    		image: imageBase64
  		};

  		// JSON 형식으로 클라이언트에게 응답
  		res.json(imageData);

  	})
	.catch((error) => {
        console.error('Error generating image:', error);
      });
  });	
});


//----------------------- 긴급더미 파일 보내기

// 이미지 생성 및 저장 라우트 핸들러
app.post('/dum', (req, res) => {
  
	// POST 요청에서 사용자 id 추출
  const id = req.body.id;

	//파일 생성 2초뒤에 함 
	function filemake (num) {
		const imageBuffer = fs.readFileSync(`dum${id}.png`);

 		 // 버퍼를 Base64로 인코딩하여 문자열로 변환
 		const base64Image = imageBuffer.toString('base64');

		
		// JSON 객체 생성
  		const imageData = {
    		image: base64Image
  		};

  		// JSON 형식으로 클라이언트에게 응답
  		res.json(imageData);
		
  		// 인코딩된 이미지 데이터를 클라이언트로 전송
  		//res.send(base64Image);
	}
	
	setTimeout(() => filemake(2), 1000);
	
});

