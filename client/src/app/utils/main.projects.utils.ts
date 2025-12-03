export function filterProjectsUtils(
  allProjects: any[],
  query: string,
  ownerFilter: 'all' | 'me' | 'others',
  userId: number
) {
  let filtered = [...allProjects];

  const lowerQuery = query.toLowerCase().trim();
  if (lowerQuery) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(lowerQuery));
  }

  if (ownerFilter === 'me') {
    filtered = filtered.filter((p) => p.owner_id === userId);
  } else if (ownerFilter === 'others') {
    filtered = filtered.filter((p) => p.owner_id !== userId);
  }

  return filtered;
}

export function populateEditFormUtils(project: any, fields: any[]) {
  return fields.map((item: any) => {
    switch (item.formControlName) {
      case 'project_name':
        return { ...item, value: project.name };
      case 'description':
        return { ...item, value: project.description };
      case 'category':
        return { ...item, value: project.category };
      case 'start_date':
        return {
          ...item,
          value: new Date(project.created_at).toISOString().split('T')[0],
        };
      default:
        return item;
    }
  });
}

export function resetFormUtils(fields: any[]) {
  return fields.map((f: any) => ({ ...f, value: '' }));
}

export function getShortNameUtil(name: string): string {
  if (!name) return '';

  const parts = name.trim().split(' ');

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function normalizeValue(val: any) {
  return typeof val === 'string' ? val.trim().replace(/\s+/g, ' ') : val;
}

export function checkBoardNoChanges(oldData: any, newData: any) {
  const oldName = normalizeValue(oldData.name);
  const oldCategory = normalizeValue(oldData.category);

  const currentName = normalizeValue(newData.name);
  const currentCategory = normalizeValue(newData.category);

  return {
    oldName,
    oldCategory,
    currentName,
    currentCategory,
    noChange: oldName === currentName && oldCategory === currentCategory,
  };
}
