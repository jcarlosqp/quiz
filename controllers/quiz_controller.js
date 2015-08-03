exports.question=function(req,res){
	res.render('quizes/question',{pregunta:'Capital de Italia?'});
};

exports.answer=function(req,res){
	if(req.query.respuesta==='Roma'){
		res.render('quizes/answer',{respuesta:'Correcto!'});
	}else{
		res.render('quizes/answer',{respuesta:'Incorrecto!'});
	}
	
};

exports.author=function(req,res){
	res.render('quizes/author',{author:'Juan Carlos Quispe Pampa'});
};




// GET /quizes
exports.index = function (req, res) {
    var buscar = req.query.search || '';

    if (buscar === '') {
        models.Quiz.findAll().then(
			function (quizes) {
			    res.render('quizes/index', { quizes: quizes, errors: [] });

			}

		);

    } else {

        buscar = buscar.replace(/ /g, '%');

        models.Quiz.findAll({ where: ["pregunta like ?", '%' + buscar + '%'], order: 'pregunta' }).then(
			function (quizes) {
			    res.render('quizes/index', { quizes: quizes, errors: [] });

			}

		);

    }

};

// GET /quizes/:id
exports.show = function (req, res) {
    models.Quiz.find(req.params.quizId).then(
		function (quiz) {
		    res.render('quizes/show', { quiz: quiz, errors: [] });

		}

	);

};

exports.new = function (req, res) {
    var quiz = models.Quiz.build(
        { pregunta: "Pregunta", respuesta: "Respuesta", tema:"Tema" }
        );
    res.render('quizes/new', { quiz: quiz });
};

exports.create = function (req, res) {
    var quiz = models.Quiz.build(req.body.quiz);

    quiz.quiz({ fields: ["pregunta", "respuesta","tema"] }).then(function () {
        res.redirect('/quizes');
    })
    
};

// GET /quizes/:id/edit
exports.edit = function (req, res) {
    var quiz = req.quiz; 

    res.render('quizes/edit', { quiz: quiz, errors: [] });

};

exports.update = function (req, res) {

    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;

    var hay_error = req.quiz.validate();

    if (hay_error) {

        var errs = [];
        for (var i in hay_error) {
            errs = errs.concat(hay_error[i]);

        }

        res.render('quizes/edit', { quiz: req.quiz, errors: errs });

    } else {

        req.quiz.save({ fields: ["pregunta", "respuesta", "tema"] }).then(

			function () { res.redirect('/quizes'); }

		);

    }

};