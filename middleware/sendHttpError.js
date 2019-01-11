module.exports = function (req, res, next) {

    // будемо створювати метод sendHttpError
    res.sendHttpError = function (error) {

        res.status(error.status);
        //якщо у нас ajax запрос то відправляємо відповідь json
        // якщо обичний запрос то виводимо рендер
        // req.xhr поверне true якщо був ajax запрос
        if (req.xhr) {
            res.json(error);
        } else {
            res.render("error", {error: error});
        }
    };
    next();
};