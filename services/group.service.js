const models = require('../models')
const Group = models.Group
const Project = models.project
const RelGroupView = models.rel_group_view
const View = models.views
const logger = require('../utils/logger');
const Filter = require('../utils/filter/filter.utils')
const QUERY_TYPES_SELECT = { type: "SELECT" }

module.exports = GroupService = {
  async getAll() {
    try {
      const groups = await Group.findAll({include: "relGroupView"});
      return await groups;
    } catch (e) {
      const msgErr = `In unit group.service, method getAll:${e}`;
      logger.error(msgErr);
      throw new Error(msgErr);
    }
  },
  async getCodGroups() {
    const codGroup = [
      {id: 1, cod_group: 'STATIC', label: 'Dados Estáticos'},
      {id: 2, cod_group: 'DYNAMIC', label: 'Dados Dinâmicos'},
      {id: 3, cod_group: 'ANALYSIS', label: ''},
      {id: 4, cod_group: 'ALERT', label: ''},
      {id: 5, cod_group: 'BURNED', label: 'Análise FOCOS'},
      {id: 6, cod_group: 'BURNED_AREA', label: 'Análise Área Queimada'},
      {id: 7, cod_group: 'DETER', label: 'Análise Deter'},
      {id: 8, cod_group: 'PRODES', label: 'Análise Prodes'},
    ];
    return codGroup;
  },
  async getById(id) {
    // Melhorar usando o include das relações
    try {
      let where = {};

      const group = await Group.findByPk(id);

      group.dataValues.project = await Project.findByPk(group.idProject);
      where = {
        where: {
          id_group: group.id
        }
      };
      group.dataValues.relViews = await RelGroupView.findAll(where)

      for(const relViews of group.dataValues.relViews){
        const id = relViews.id_view;
        relViews.dataValues.view = await View.findByPk(id);
      }
      return group;

    } catch (e) {
      const msgErr = `In unit group.service, method getById:${e}`;
      logger.error(msgErr);
      throw new Error(msgErr);
    }
  },
  async add(newGroup) {
    const group = new Group({
      name: newGroup.name,
      idProject: newGroup.idProject,
      code: newGroup.code
    })
    return await Group.create(group.dataValues).then(group => group.dataValues);
  },
  async update(groupModify) {
    const group = await Group.findByPk(groupModify.id);
    group.name = groupModify.name;
    group.idProject = groupModify.idProject;
    group.code = groupModify.code;
    await group.save();
    return group.dataValues;
  },

  async deleteGroup(groupId) {
    const group = await Group.findByPk(groupId);
    return await group.destroy().then(result => result);
  }
};
