/*
 *
 * Export Page
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { map } from 'lodash';
import { List, PluginHeader, ListWrapper } from 'strapi-helper-plugin';

import pluginId from '../../pluginId';
import Nav from '../../components/Nav';
import { getModels } from '../../utils/contentApis';
import ExportModel from './ExportModel';
import { MainDiv } from './ui-components';

// Content types to be included in the export panel
const required_models = ['tours', 'booking-information'];
const ExportPage = () => {
  const [models, setModels] = useState([]);
  useEffect(() => {
    async function loadContentTypes () {
      const allModels = await getModels();
      const models = allModels.filter(model =>
        required_models.includes(model.apiID)
      );
      setModels(models);
    }

    loadContentTypes();
  }, []);

  return (
    <div className="container-fluid" style={{ padding: '18px 30px' }}>
      <PluginHeader
        title="Export Content"
        description={pluginId + ' / Export content to file'}
      />
      <Nav />
      <MainDiv>
        <h2>Content Types</h2>
        <ListWrapper>
          <List>
            {map(models, model => (
              <ExportModel key={model.uid} model={model} />
            ))}
          </List>
        </ListWrapper>
      </MainDiv>
    </div>
  );
};

export default memo(ExportPage);
