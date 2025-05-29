import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/base/base.service';
import { Jabatan } from 'src/common/schemas/jabatan.schema';
import { BaseResponse } from 'src/common/base/base.response';

@Injectable()
export class JabatanService extends BaseService<Jabatan> {
  constructor(@InjectModel('Jabatan') private jabatanModel: Model<Jabatan>) {
    super(jabatanModel);
  }

  // Override findAll untuk mendukung hierarchy dan filter sekolah
  override async findAll(query?: any): Promise<BaseResponse<Jabatan[]>> {
    try {
      const filter: any = {};

      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      if (query?.parent_only === 'true') {
        filter.jabatan_id = null; // Hanya ambil jabatan parent
      }

      if (query?.is_active !== undefined) {
        filter.is_active = query.is_active === 'true';
      }

      const entities = await this.model
        .find(filter)
        .populate('jabatan_id')
        .populate('school_id')
        .exec();

      return new BaseResponse<Jabatan[]>(
        HttpStatus.OK,
        'Jabatan fetched successfully',
        entities,
      );
    } catch (error) {
      return new BaseResponse<Jabatan[]>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching jabatan',
        null,
        error.message,
      );
    }
  }

  // Get jabatan hierarchy (parent dengan children)
  async getHierarchy(query?: any): Promise<BaseResponse<any[]>> {
    try {
      const filter: any = {};

      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      // Ambil semua jabatan
      const allJabatan = await this.model
        .find(filter)
        .populate('jabatan_id')
        .populate('school_id')
        .exec();

      // Build hierarchy tree
      const hierarchy = this.buildHierarchy(allJabatan);

      return new BaseResponse<any[]>(
        HttpStatus.OK,
        'Jabatan hierarchy fetched successfully',
        hierarchy,
      );
    } catch (error) {
      return new BaseResponse<any[]>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching jabatan hierarchy',
        null,
        error.message,
      );
    }
  }

  // Get children of specific jabatan
  async getChildren(
    parentId: string,
    query?: any,
  ): Promise<BaseResponse<Jabatan[]>> {
    try {
      const filter: any = { jabatan_id: parentId };

      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const children = await this.model
        .find(filter)
        .populate('jabatan_id')
        .populate('school_id')
        .exec();

      return new BaseResponse<Jabatan[]>(
        HttpStatus.OK,
        'Children jabatan fetched successfully',
        children,
      );
    } catch (error) {
      return new BaseResponse<Jabatan[]>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching children jabatan',
        null,
        error.message,
      );
    }
  }

  // Helper method untuk build hierarchy tree
  private buildHierarchy(jabatanList: Jabatan[]): any[] {
    const jabatanMap = new Map();
    const result = [];

    // Create map for easier lookup
    jabatanList.forEach((jabatan) => {
      jabatanMap.set(jabatan._id.toString(), {
        ...jabatan.toObject(),
        children: [],
      });
    });

    // Build hierarchy
    jabatanList.forEach((jabatan) => {
      const jabatanObj = jabatanMap.get(jabatan._id.toString());
      if (jabatan.jabatan_id) {
        const parent = jabatanMap.get(jabatan.jabatan_id.toString());
        if (parent) {
          parent.children.push(jabatanObj);
        }
      } else {
        result.push(jabatanObj);
      }
    });

    return result;
  }

  // Override create untuk menambahkan school_id dari query
  override async create(
    createDto: any,
    query?: any,
  ): Promise<BaseResponse<Jabatan>> {
    try {
      const jabatanToCreate = {
        ...createDto,
        school_id: query?.school_id,
      };

      return super.create(jabatanToCreate);
    } catch (error) {
      return new BaseResponse<Jabatan>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating jabatan',
        null,
        error.message,
      );
    }
  }
}
