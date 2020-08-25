interface Resource {
  ctime: Number;
  id: string;
  meta: {
    resource_id: string;
    total_results_count: number;
  };
  mtime: number;
  name: string;
  path: string;
  type: string;
  utime: number;
}

export default Resource;
