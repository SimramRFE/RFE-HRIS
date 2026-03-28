const express = require('express');
const request = require('supertest');

jest.mock('../middleware/auth', () => ({
  protect: (req, res, next) => next()
}));

jest.mock('../middleware/upload', () => ({
  array: jest.fn()
}));

const upload = require('../middleware/upload');
const uploadRoutes = require('../routes/uploadRoutes');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/upload', uploadRoutes);
  return app;
};

describe('upload routes', () => {
  beforeEach(() => {
    upload.array.mockReset();
  });

  test('returns clear error when file count limit is exceeded', async () => {
    upload.array.mockReturnValue((req, res, cb) => {
      cb({ code: 'LIMIT_FILE_COUNT' });
    });

    const app = createApp();
    const response = await request(app).post('/api/upload');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/^You can upload up to \d+ files at once$/);
  });

  test('returns no files uploaded when middleware succeeds but files are missing', async () => {
    upload.array.mockReturnValue((req, res, cb) => {
      req.files = [];
      cb();
    });

    const app = createApp();
    const response = await request(app).post('/api/upload');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'No files uploaded'
    });
  });

  test('returns uploaded document metadata on success', async () => {
    upload.array.mockReturnValue((req, res, cb) => {
      req.files = [
        {
          originalname: 'passport.pdf',
          filename: '123-passport.pdf',
          size: 12000,
          mimetype: 'application/pdf'
        }
      ];
      cb();
    });

    const app = createApp();
    const response = await request(app).post('/api/upload');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Documents uploaded successfully');
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      name: 'passport.pdf',
      url: '/uploads/documents/123-passport.pdf',
      size: 12000,
      type: 'application/pdf'
    });
  });
});
