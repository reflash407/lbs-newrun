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
    ctx.strokeStyle = '#4D60FF';
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
        // 이미지를 서버 컴퓨터에 저장
        const imagePath = `route_${id}.png`;
        const out = fs.createWriteStream(imagePath);
        const stream = image.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
          console.log('Image saved:', imagePath);
        });
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  });
	
	//파일 생성 2초뒤에 함 
	function filemake (num) {
		const imageBuffer = fs.readFileSync(`route_${id}.png`);

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







//---------------------------------------------------------------------------------------
	
	
	
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




generateImageFromRoute(routeData)
  .then((image) => {
    image.createPNGStream()
      .on('data', (chunk) => {
        res.write(chunk); // 이미지 데이터를 클라이언트로 전송
      })
      .on('end', () => {
        res.end(); // 전송 완료
      })
      .on('error', (error) => {
        console.error('Error generating image:', error);
        res.status(500).send('Internal Server Error');
      });
  })
  .catch((error) => {
    console.error('Error generating image:', error);
    res.status(500).send('Internal Server Error');
  });