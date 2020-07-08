import { db } from '../models/index.js';
import { Grade } from '../models/schemas.js';
import { logger } from '../config/logger.js';

const create = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: 'Dados para atualizacao vazio',
            });
        }

        const grade = new Grade({ ...req.body, lastModified: new Date()});

        await grade.save();

        res.json(grade);
        logger.info(`POST /grade - ${JSON.stringify(grade)}`);
    } catch (error) {
        res
            .status(500)
            .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
        logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
    }
};

const findAll = async (req, res) => {
    const name = req.query.name;

    //condicao para o filtro no findAll
    var condition = name
        ? { name: { $regex: new RegExp(name), $options: 'i' } }
        : {};

    const grades = await Grade.find(condition).exec();

    try {
        res.json(grades || { message: "Não existem Grades"});
        logger.info(`GET /grade`);
    } catch (error) {
        res
            .status(500)
            .send({ message: error.message || 'Erro ao listar todos os documentos' });
        logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
    }
};

const findOne = async (req, res) => {
    const id = req.params.id;

    const grade = await Grade.findById(id).exec();

    try {
        res.json(grade || { message: "Grade não existe" });

        logger.info(`GET /grade - ${id}`);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
        logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
    }
};

const update = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: 'Dados para atualizacao vazio',
            });
        }

        const id = req.params.id;

        await Grade.findByIdAndUpdate(id, { ...req.body }, { useFindAndModify: false }).exec();
        const grade = await Grade.findById(id).exec();

        res.json({ message: 'Grade atualizado com sucesso', grade });

        logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
        logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params.id;
        
        await Grade.findByIdAndDelete(id).exec();
        const grade = await Grade.findById(id).exec();

        if (!grade) {
            res.json({ message: 'Grade excluido com sucesso' });
        } else {
            res.json({ message: 'Erro ao excluir Grade' });
        }

        logger.info(`DELETE /grade - ${id}`);
    } catch (error) {
        res
            .status(500)
            .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
        logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
    }
};

const removeAll = async (req, res) => {
    const id = req.params.id;

    await Grade.deleteMany({}).exec();
    const grades = await Grade.find({}).exec();

    try {
        res.json({
            message: `Grades excluidos`,
            grades
        });
        logger.info(`DELETE /grade`);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
        logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
    }
};

export default { create, findAll, findOne, update, remove, removeAll };
