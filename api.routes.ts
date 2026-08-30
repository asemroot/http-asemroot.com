@api_bp.route("", methods=["GET"])
def api_index():
    return jsonify({
        "service": "ASEM API",
        "status": "ok",
        "version": "1.0",
        "endpoints": {
            "health": "/api/health",
            "countries": "/api/countries",
            "cities": "/api/cities",
            "businesses": "/api/businesses",
            "tourism": "/api/tourism",
            "products": "/api/products",
            "projects": "/api/projects",
            "location": "/api/location"
        }
    }), 200
> cat api.routes.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

@Controller()
export class ApiRoutesController {
  // =========================================================
  // HEALTH
  // GET /api/health
  // =========================================================
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'employment-ai',
      timestamp: new Date().toISOString(),
    };
  }

  // =========================================================
  // SEARCH
  // GET /api/search?q=developer
  // =========================================================
  @Get('search')
  search(@Query('q') q = '') {
    return {
      success: true,
      query: q,
      results: [],
    };
  }

  // =========================================================
  // AI
  // POST /api/ai
  // =========================================================
  @Post('ai')
  ai(@Body() body: any) {
    return {
      success: true,
      message: 'AI endpoint is available',
      input: body ?? {},
      results: [],
    };
  }

  // =========================================================
  // USERS
  // GET /api/users
  // =========================================================
  @Get('users')
  getUsers() {
    return {
      success: true,
      results: [],
    };
  }

  // =========================================================
  // USER
  // GET /api/users/:id
  // =========================================================
  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return {
      success: true,
      id,
      user: null,
    };
  }

  // =========================================================
  // CREATE USER
  // POST /api/users
  // =========================================================
  @Post('users')
  createUser(@Body() body: any) {
    return {
      success: true,
      message: 'User created',
      user: body ?? {},
    };
  }

  // =========================================================
  // UPDATE USER
  // PUT /api/users/:id
  // =========================================================
  @Put('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return {
      success: true,
      message: 'User updated',
      id,
      user: body ?? {},
    };
  }

  // =========================================================
  // DELETE USER
  // DELETE /api/users/:id
  // =========================================================
  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: string) {
    return {
      success: true,
      message: 'User deleted',
      id,
    };
  }

  // =========================================================
  // LOCATION
  // GET /api/location
  // =========================================================
  @Get('location')
  location(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    return {
      success: true,
      latitude: lat ?? null,
      longitude: lng ?? null,
      results: [],
    };
  }

  // =========================================================
  // COUNTRIES
  // GET /api/countries
  // =========================================================
  @Get('countries')
  countries() {
    return {
      success: true,
      results: [],
    };
  }

  // =========================================================
  // COUNTRY
  // GET /api/countries/:country
  // =========================================================
  @Get('countries/:country')
  country(@Param('country') country: string) {
    return {
      success: true,
      country,
      results: [],
    };
  }

  // =========================================================
  // PROJECTS
  // GET /api/projects
  // =========================================================
  @Get('projects')
  projects() {
    return {
      success: true,
      results: [],
    };
  }

  // =========================================================
  // PROJECT
  // GET /api/projects/:id
  // =========================================================
  @Get('projects/:id')
  project(@Param('id') id: string) {
    return {
      success: true,
      id,
      project: null,
    };
  }

  // =========================================================
  // COMPANIES
  // GET /api/companies
  // =========================================================
  @Get('companies')
  companies() {
    return {
      success: true,
      results: [],
    };
  }

  // =========================================================
  // COMPANY
  // GET /api/companies/:id
  // =========================================================
  @Get('companies/:id')
  company(@Param('id') id: string) {
    return {
      success: true,
      id,
      company: null,
    };
  }

  // =========================================================
  // JOBS
  // GET /api/jobs
  // =========================================================
  @Get('jobs')
  jobs(
    @Query('q') q = '',
    @Query('location') location = '',
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return {
      success: true,
      query: q,
      location,
      page: Number(page),
      limit: Number(limit),
      results: [],
    };
  }

  // =========================================================
  // JOB
  // GET /api/jobs/:id
  // =========================================================
  @Get('jobs/:id')
  job(@Param('id') id: string) {
    return {
      success: true,
      id,
      job: null,
    };
  }

  // =========================================================
  // PRODUCTS
  // GET /api/products
  // =========================================================
  @Get('products')
  products() {
    return {
      success: true,
      results: [],
    };
  }

  // =========================================================
  // TOURISM
  // GET /api/tourism
  // =========================================================
  @Get('tourism')
  tourism(
    @Query('q') q = '',
    @Query('country') country = '',
    @Query('city') city = '',
  ) {
    return {
      success: true,
      query: q,
      country,
      city,
      results: [],
    };
  }

  // =========================================================
  // AUTH STATUS
  // GET /api/auth/status
  // =========================================================
  @Get('auth/status')
  authStatus() {
    return {
      success: true,
      authenticated: false,
      user: null,
    };
  }

  // =========================================================
  // API INFO
  // GET /api
  // =========================================================
  @Get()
  apiInfo() {
    return {
      success: true,
      name: 'ASEM API',
      version: '1.0.0',
      service: 'employment-ai',
      routes: [
        'GET /api',
        'GET /api/health',
        'GET /api/search',
        'POST /api/ai',
        'GET /api/users',
        'GET /api/users/:id',
        'POST /api/users',
        'PUT /api/users/:id',
        'DELETE /api/users/:id',
        'GET /api/location',
        'GET /api/countries',
        'GET /api/countries/:country',
        'GET /api/projects',
        'GET /api/projects/:id',
        'GET /api/companies',
        'GET /api/companies/:id',
        'GET /api/jobs',
        'GET /api/jobs/:id',
        'GET /api/products',
        'GET /api/tourism',
        'GET /api/auth/status',
      ],
    };
  }
}
