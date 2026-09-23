# Funções do projeto

Catálogo automático de 633 funções nomeadas. Funções anônimas passadas diretamente como callbacks não aparecem como itens independentes.

## Acessibilidade

### `src/features/accessibility/accessibility-menu.tsx`

- **clampPosition** — linha 55; função; interna; parâmetros: `position: ButtonPosition`
- **AccessibilityMenu** — linha 62; função; exportada; parâmetros: `nenhum`
- **syncAcrossTabs** — linha 85; função; interna; parâmetros: `event: StorageEvent`
- **syncInThisTab** — linha 99; função; interna; parâmetros: `event: Event`
- **keepButtonVisible** — linha 107; arrow; interna; parâmetros: `nenhum`
- **updatePreferences** — linha 117; função; interna; parâmetros: `update: Partial<AccessibilityPreferences>,`
- **startDrag** — linha 126; função; interna; parâmetros: `event: ReactPointerEvent<HTMLButtonElement>`
- **moveButton** — linha 139; função; interna; parâmetros: `event: ReactPointerEvent<HTMLButtonElement>`
- **finishDrag** — linha 148; função; interna; parâmetros: `event: ReactPointerEvent<HTMLButtonElement>`
- **resetPreferences** — linha 166; função; interna; parâmetros: `nenhum`
- **PreferenceGroup** — linha 315; função; interna; parâmetros: `{ legend, children, }: { legend: string; children: ReactNode; }`
- **Choice** — linha 330; função; interna; parâmetros: `{ children, ...props }: ComponentProps<'input'> & { children: ReactNode }`
### `src/features/accessibility/preferences.ts`

- **parseAccessibilityPreferences** — linha 37; função; exportada; parâmetros: `value: unknown,`
- **applyAccessibilityPreferences** — linha 71; função; exportada; parâmetros: `preferences: AccessibilityPreferences,`
- **readAccessibilityPreferences** — linha 96; função; exportada; parâmetros: `nenhum`
- **saveAccessibilityPreferences** — linha 109; função; exportada; parâmetros: `preferences: AccessibilityPreferences,`

## Administração

### `src/app/admin/(auth)/login/page.tsx`

- **AdminLoginPage** — linha 15; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ error?: string; status?: string }> }`
### `src/app/admin/(secure)/admins/new/page.tsx`

- **NewAdminPage** — linha 7; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/admins/page.tsx`

- **AdminsPage** — linha 9; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/apis/page.tsx`

- **AdminApisPage** — linha 11; assíncrona função; exportada; parâmetros: `nenhum`
- **Metric** — linha 25; função; interna; parâmetros: `{ icon: Icon, label, value, detail }: { icon: typeof Activity; label: string; value: string; detail: string }`
### `src/app/admin/(secure)/audit/page.tsx`

- **AuditPage** — linha 5; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/author-profiles/page.tsx`

- **AdminAuthorProfilesPage** — linha 11; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/extensions/page.tsx`

- **AdminExtensionsPage** — linha 10; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/flags/page.tsx`

- **AdminFlagsPage** — linha 8; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/guidance/page.tsx`

- **csv** — linha 13; função; interna; parâmetros: `values: string[]`
- **AdminGuidancePage** — linha 15; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/guidance/playground/page.tsx`

- **GuidancePlaygroundPage** — linha 8; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/layout.tsx`

- **AdminSecureLayout** — linha 6; assíncrona função; exportada; parâmetros: `{ children }: { children: React.ReactNode }`
### `src/app/admin/(secure)/legal/page.tsx`

- **AdminLegalPage** — linha 11; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/loading.tsx`

- **AdminLoading** — linha 1; função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/page.tsx`

- **AdminHomePage** — linha 7; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ error?: string }> }`
### `src/app/admin/(secure)/publish/loading.tsx`

- **OmniPublishLoading** — linha 1; função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/publish/new/page.tsx`

- **NewOmniPublishCampaignPage** — linha 6; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ channel?: string }> }`
### `src/app/admin/(secure)/publish/page.tsx`

- **OmniPublishPage** — linha 10; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ created?: string }> }`
### `src/app/admin/(secure)/sound/page.tsx`

- **AdminSoundPage** — linha 11; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/admin/(secure)/users/page.tsx`

- **AdminUsersPage** — linha 10; assíncrona função; exportada; parâmetros: `nenhum`
### `src/features/admin/actions/author-profiles.ts`

- **text** — linha 10; função; interna; parâmetros: `formData: FormData, key: string, max: number`
- **benefits** — linha 11; função; interna; parâmetros: `formData: FormData`
- **archetypeValues** — linha 12; função; interna; parâmetros: `formData: FormData`
- **createAuthorArchetype** — linha 22; assíncrona função; exportada; parâmetros: `formData: FormData`
- **updateAuthorArchetype** — linha 33; assíncrona função; exportada; parâmetros: `formData: FormData`
### `src/features/admin/actions/create-admin.ts`

- **createAdministrativeUser** — linha 11; assíncrona função; exportada; parâmetros: `_previousState: CreateAdminState, formData: FormData,`
### `src/features/admin/actions/login.ts`

- **adminLogin** — linha 8; assíncrona função; exportada; parâmetros: `_previousState: LoginState, formData: FormData,`
### `src/features/admin/actions/logout.ts`

- **adminLogout** — linha 7; assíncrona função; exportada; parâmetros: `nenhum`
### `src/features/admin/actions/omnipublish.ts`

- **clean** — linha 17; função; interna; parâmetros: `value: unknown, max = 2000`
- **safeFileName** — linha 21; função; interna; parâmetros: `name: string`
- **legalSections** — linha 25; função; interna; parâmetros: `body: string`
- **prepareCommunicationMediaUpload** — linha 38; assíncrona função; exportada; parâmetros: `input: { fileName: string; mimeType: string; size: number }`
- **registerCommunicationMediaAsset** — linha 50; assíncrona função; exportada; parâmetros: `input: { uploadId: string; path: string; fileName: string; mimeType: string; size: number; title: string; altText: string; caption: string }`
- **saveCommunicationComponent** — linha 77; assíncrona função; exportada; parâmetros: `input: { name: string; description: string; category: string; htmlCode: string; cssCode: string; jsCode: string }`
- **validateCampaign** — linha 106; função; interna; parâmetros: `input: CampaignDraftInput`
- **createCommunicationCampaign** — linha 117; assíncrona função; exportada; parâmetros: `input: CampaignDraftInput`
- **changeCommunicationCampaignStatus** — linha 183; assíncrona função; exportada; parâmetros: `formData: FormData`
- **createCommunicationApiKey** — linha 240; assíncrona função; exportada; parâmetros: `input: { name: string; scopes: string[]; expiresAt?: string | null }`
- **revokeCommunicationApiKey** — linha 266; assíncrona função; exportada; parâmetros: `formData: FormData`
- **archiveCommunicationCampaign** — linha 276; assíncrona função; exportada; parâmetros: `formData: FormData`
### `src/features/admin/actions/product-controls.ts`

- **list** — linha 11; função; interna; parâmetros: `value: FormDataEntryValue | null`
- **updateExtensionControl** — linha 15; assíncrona função; exportada; parâmetros: `formData: FormData`
- **updateExtensionEntitlement** — linha 43; assíncrona função; exportada; parâmetros: `formData: FormData`
- **updateFeatureFlag** — linha 66; assíncrona função; exportada; parâmetros: `formData: FormData`
- **updateUserAccess** — linha 78; assíncrona função; exportada; parâmetros: `formData: FormData`
- **updateUserSubscription** — linha 90; assíncrona função; exportada; parâmetros: `formData: FormData`
- **syncLegalDocuments** — linha 119; assíncrona função; exportada; parâmetros: `nenhum`
- **updateLegalDocument** — linha 129; assíncrona função; exportada; parâmetros: `formData: FormData`
### `src/features/admin/actions/product-guidance.ts`

- **list** — linha 14; função; interna; parâmetros: `value: FormDataEntryValue | null`
- **text** — linha 18; função; interna; parâmetros: `formData: FormData, key: string, max = 2000`
- **guideValues** — linha 22; função; interna; parâmetros: `formData: FormData, actorId: string`
- **stepValues** — linha 45; função; interna; parâmetros: `formData: FormData`
- **createProductGuide** — linha 65; assíncrona função; exportada; parâmetros: `formData: FormData`
- **updateProductGuide** — linha 81; assíncrona função; exportada; parâmetros: `formData: FormData`
- **updateProductGuideStep** — linha 98; assíncrona função; exportada; parâmetros: `formData: FormData`
- **addProductGuideStep** — linha 112; assíncrona função; exportada; parâmetros: `formData: FormData`
- **reannounceProductGuide** — linha 125; assíncrona função; exportada; parâmetros: `formData: FormData`
### `src/features/admin/actions/sound-library.ts`

- **safeFileName** — linha 14; função; interna; parâmetros: `name: string`
- **list** — linha 15; função; interna; parâmetros: `value: FormDataEntryValue | null`
- **createAudioTrack** — linha 17; assíncrona função; exportada; parâmetros: `formData: FormData`
- **prepareAudioTrackUpload** — linha 62; assíncrona função; exportada; parâmetros: `input: { audioName: string; audioType: string; audioSize: number; coverName?: string; coverType?: string; coverSize?: number }`
- **updateAudioTrack** — linha 82; assíncrona função; exportada; parâmetros: `formData: FormData`
- **deleteAudioTrack** — linha 95; assíncrona função; exportada; parâmetros: `formData: FormData`
### `src/features/admin/audit.ts`

- **firstForwardedValue** — linha 19; função; interna; parâmetros: `value: string | null`
- **writeAdminAudit** — linha 23; assíncrona função; exportada; parâmetros: `event: AuditEvent`
### `src/features/admin/auth.ts`

- **getAdminContext** — linha 16; assíncrona função; exportada; parâmetros: `nenhum`
- **requireAdmin** — linha 40; assíncrona função; exportada; parâmetros: `permission?: AdminPermission`
### `src/features/admin/components/admin-accounts-table.tsx`

- **AdminAccountsTable** — linha 43; função; exportada; parâmetros: `{ accounts }: { accounts: AdminAccountRow[] }`
### `src/features/admin/components/admin-command-palette.tsx`

- **AdminCommandPalette** — linha 32; função; exportada; parâmetros: `{ commands }: { commands: AdminCommand[] }`
- **handleKeyDown** — linha 37; arrow; interna; parâmetros: `event: KeyboardEvent`
- **run** — linha 47; arrow; interna; parâmetros: `href: string`
### `src/features/admin/components/admin-login-form.tsx`

- **SubmitButton** — linha 14; função; interna; parâmetros: `nenhum`
- **AdminLoginForm** — linha 23; função; exportada; parâmetros: `nenhum`
### `src/features/admin/components/admin-shell.tsx`

- **isCurrent** — linha 39; função; interna; parâmetros: `pathname: string, href: string`
- **AdminShell** — linha 43; função; exportada; parâmetros: `{ children, displayName, roleLabel, environment, commands, navigation, }: { children: React.ReactNode; displayName: string; roleLabel: string; environment: string; commands: AdminCommand[]; navigation: AdminNavItem[]; }`
- **close** — linha 65; arrow; interna; parâmetros: `event: KeyboardEvent`
### `src/features/admin/components/api-key-manager.tsx`

- **ApiKeyManager** — linha 14; função; exportada; parâmetros: `nenhum`
- **createKey** — linha 22; função; interna; parâmetros: `nenhum`
- **copy** — linha 33; assíncrona função; interna; parâmetros: `nenhum`
### `src/features/admin/components/audit-events-table.tsx`

- **AuditEventsTable** — linha 48; função; exportada; parâmetros: `{ events }: { events: AuditEventRow[] }`
### `src/features/admin/components/create-admin-form.tsx`

- **SubmitButton** — linha 14; função; interna; parâmetros: `nenhum`
- **CreateAdminForm** — linha 23; função; exportada; parâmetros: `nenhum`
### `src/features/admin/components/guidance-playground.tsx`

- **GuidancePlayground** — linha 8; função; exportada; parâmetros: `{ targets }: { targets: Target[] }`
- **copy** — linha 14; assíncrona função; interna; parâmetros: `value: string, key: string`
### `src/features/admin/components/guide-code-preview.tsx`

- **escapeClosingScript** — linha 6; função; interna; parâmetros: `value: string`
- **hydrate** — linha 10; função; interna; parâmetros: `template: string, values: Record<string, string>`
- **GuideCodePreview** — linha 14; função; exportada; parâmetros: `{ html, css, js, title, message, actionLabel }: { html: string; css: string; js: string; title: string; message: string; actionLabel: string }`
### `src/features/admin/components/sound-upload-form.tsx`

- **SoundUploadForm** — linha 12; função; exportada; parâmetros: `nenhum`
- **submit** — linha 20; assíncrona função; interna; parâmetros: `event: React.FormEvent<HTMLFormElement>`
### `src/features/admin/omnipublish/creative-composer.tsx`

- **iconMarkup** — linha 25; função; interna; parâmetros: `icon: (typeof iconLibrary`
- **CreativeComposer** — linha 29; função; exportada; parâmetros: `{ value, onChange, initialComponents, initialAssets }: { value: CodeValue; onChange: (value: CodeValue`
- **insertComponent** — linha 47; função; interna; parâmetros: `component: CommunicationComponent`
- **insertAsset** — linha 52; função; interna; parâmetros: `asset: CommunicationMediaAsset`
- **upload** — linha 60; assíncrona função; interna; parâmetros: `file: File`
- **saveAsComponent** — linha 76; função; interna; parâmetros: `nenhum`
- **CodeEditor** — linha 100; função; interna; parâmetros: `{ label, language, value, onChange, rows }: { label: string; language: string; value: string; onChange: (value: string`
- **QuickInsert** — linha 104; função; interna; parâmetros: `{ icon: Icon, label, onClick }: { icon: typeof Quote; label: string; onClick: (`
- **escapeHtml** — linha 106; função; interna; parâmetros: `value: string`
- **escapeAttribute** — linha 107; função; interna; parâmetros: `value: string`
### `src/features/admin/omnipublish/omnipublish-board.tsx`

- **OmniPublishBoard** — linha 15; função; exportada; parâmetros: `{ campaigns, canManage }: { campaigns: CampaignOverview[]; canManage: boolean }`
- **Metric** — linha 45; função; interna; parâmetros: `{ label, value, detail, icon: Icon }: { label: string; value: number; detail: string; icon: typeof Megaphone }`
- **CampaignDetail** — linha 49; função; interna; parâmetros: `{ campaign, onOpenChange, canManage }: { campaign: CampaignOverview | null; onOpenChange: (open: boolean`
- **StatusButton** — linha 53; função; interna; parâmetros: `{ id, status, label, icon: Icon, primary = false }: { id: string; status: string; label: string; icon: typeof Eye; primary?: boolean }`
- **formatDate** — linha 57; função; interna; parâmetros: `value: string`
- **relativeDate** — linha 58; função; interna; parâmetros: `value: string`
### `src/features/admin/omnipublish/omnipublish-studio.tsx`

- **initialItems** — linha 23; função; interna; parâmetros: `title = ''`
- **slugify** — linha 30; função; interna; parâmetros: `value: string`
- **OmniPublishStudio** — linha 34; função; exportada; parâmetros: `{ initialComponents, initialAssets, initialChannel }: { initialComponents: CommunicationComponent[]; initialAssets: CommunicationMediaAsset[]; initialChannel?: CommunicationChannel }`
- **updateMasterTitle** — linha 56; função; interna; parâmetros: `value: string`
- **toggleChannel** — linha 69; função; interna; parâmetros: `channel: CommunicationChannel`
- **updateField** — linha 74; função; interna; parâmetros: `channel: CommunicationChannel, key: string, value: string | boolean`
- **goNext** — linha 78; função; interna; parâmetros: `nenhum`
- **saveCampaign** — linha 85; função; interna; parâmetros: `nenhum`
- **BriefingStep** — linha 130; função; interna; parâmetros: `{ internalName, setInternalName, title, updateMasterTitle, summary, setSummary, tags, setTags, audience, setAudience, scheduledFor, setScheduledFor }: { internalName: string; setInternalName: (value: string`
- **ChannelStep** — linha 140; função; interna; parâmetros: `{ selected, toggle }: { selected: CommunicationChannel[]; toggle: (channel: CommunicationChannel`
- **CompositionStep** — linha 144; função; interna; parâmetros: `{ selected, active, setActive, items, setItems, updateField, initialComponents, initialAssets }: { selected: CommunicationChannel[]; active: CommunicationChannel; setActive: (channel: CommunicationChannel`
- **ChannelPreview** — linha 155; função; interna; parâmetros: `{ channel, item }: { channel: CommunicationChannel; item: ChannelDraft }`
- **ReviewStep** — linha 163; função; interna; parâmetros: `{ title, summary, selected, items, scheduledFor, audience }: { title: string; summary: string; selected: CommunicationChannel[]; items: Record<CommunicationChannel, ChannelDraft>; scheduledFor: string; audience: Campaign`
### `src/features/admin/omnipublish/render-code-page.ts`

- **buildOmniPublishSandboxDocument** — linha 1; função; exportada; parâmetros: `value: { html: string; css: string; js: string }`
### `src/features/admin/omnipublish/types.ts`

- **slugifyPublication** — linha 42; função; exportada; parâmetros: `value: string`
- **publicationPath** — linha 46; função; exportada; parâmetros: `channel: CommunicationChannel, slug: string`
- **payloadAsRecord** — linha 164; função; exportada; parâmetros: `payload: Json`
### `src/features/admin/rbac.ts`

- **hasAdminPermission** — linha 69; função; exportada; parâmetros: `role: AdminRole, permission: AdminPermission`
- **isAdminRole** — linha 73; função; exportada; parâmetros: `value: unknown`

## Ambiente de escrita

### `src/app/(writing)/layout.tsx`

- **WritingLayout** — linha 8; assíncrona função; exportada; parâmetros: `{ children }: { children: React.ReactNode }`
### `src/app/(writing)/loading.tsx`

- **WritingLoading** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/(writing)/write/[view]/page.tsx`

- **WritingViewPage** — linha 15; assíncrona função; exportada; parâmetros: `{ params, searchParams, }: { params: Promise<{ view: string }>; searchParams: Promise<{ document?: string; work?: string }>; }`
### `src/app/(writing)/write/page.tsx`

- **WritePage** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/features/writing/components/encyclopedia-view.tsx`

- **updatedLabel** — linha 43; função; interna; parâmetros: `value: string`
- **emptyDraft** — linha 60; função; interna; parâmetros: `type: EncyclopediaEntryType = 'character'`
- **TextField** — linha 87; função; interna; parâmetros: `{ label, value, onChange, maxLength, placeholder, rows = 0 }: { label: string; value: string; onChange: (value: string`
- **ListQuestion** — linha 98; função; interna; parâmetros: `{ question, values, onChange }: { question: WorldbuildingQuestion; values: string[]; onChange: (values: string[]`
- **addItem** — linha 100; função; interna; parâmetros: `nenhum`
- **QuestionField** — linha 111; função; interna; parâmetros: `{ namespace, question, answers, onChange }: { namespace: string; question: WorldbuildingQuestion; answers: Record<string, string | string[] | boolean>; onChange: (answers: Record<string, string | string[] | boolean>`
- **update** — linha 119; arrow; interna; parâmetros: `value: string | string[] | boolean`
- **SchemaSections** — linha 127; função; interna; parâmetros: `{ namespace, sections, answers, onChange }: { namespace: string; sections: WorldbuildingSection[]; answers: Record<string, string | string[] | boolean>; onChange: (answers: Record<string, string | string[] | boolean>`
- **foundationSteps** — linha 143; função; interna; parâmetros: `profile: WorldbuildingProfile`
- **FoundationJourney** — linha 165; função; interna; parâmetros: `{ profile, onChange, onSave, saving, error }: { profile: WorldbuildingProfile; onChange: (profile: WorldbuildingProfile`
- **move** — linha 171; assíncrona função; interna; parâmetros: `nextIndex: number, completed = false`
- **applyPreset** — linha 177; função; interna; parâmetros: `presetId: string`
- **EncyclopediaView** — linha 202; função; exportada; parâmetros: `{ entries, workId, ownerId, workTitle, persistence, worldbuildingProfile, onSave, onDelete, onSaveWorldbuilding, }: { entries: EncyclopediaEntry[]; workId: string; ownerId: string; workTitle: string; persistence: 'cloud'`
- **startCreating** — linha 249; função; interna; parâmetros: `type: EncyclopediaEntryType = 'character'`
- **startEditing** — linha 254; função; interna; parâmetros: `entry: EncyclopediaEntry`
- **applyExample** — linha 269; função; interna; parâmetros: `example: (typeof examples`
- **submit** — linha 275; assíncrona função; interna; parâmetros: `nenhum`
- **remove** — linha 293; assíncrona função; interna; parâmetros: `nenhum`
- **saveWorldbuilding** — linha 300; assíncrona função; interna; parâmetros: `profile = worldDraft`
### `src/features/writing/components/universe-architecture.tsx`

- **UniverseArchitecture** — linha 16; função; exportada; parâmetros: `{ ownerId, workId, workTitle, entries, standalone = false }: { ownerId: string; workId: string; workTitle: string; entries: EncyclopediaEntry[]; standalone?: boolean }`
- **createStructure** — linha 46; assíncrona função; interna; parâmetros: `nenhum`
- **linkCurrentWork** — linha 61; assíncrona função; interna; parâmetros: `universeId: string`
- **addRelation** — linha 68; assíncrona função; interna; parâmetros: `nenhum`
- **deleteRelation** — linha 76; assíncrona função; interna; parâmetros: `edgeId: string`
- **entryName** — linha 86; arrow; interna; parâmetros: `id: string`
### `src/features/writing/components/writing-nav-icons.tsx`

- **Base** — linha 12; função; interna; parâmetros: `{ size = 18, active, className = "", children, ...props }: IconProps & { children: React.ReactNode }`
- **BookMark** — linha 41; função; exportada; parâmetros: `props: IconProps`
- **HomeIcon** — linha 52; função; exportada; parâmetros: `props: IconProps`
- **LibraryIcon** — linha 70; função; exportada; parâmetros: `props: IconProps`
- **OverviewIcon** — linha 93; função; exportada; parâmetros: `props: IconProps`
- **EditorIcon** — linha 110; função; exportada; parâmetros: `props: IconProps`
- **EncyclopediaIcon** — linha 127; função; exportada; parâmetros: `props: IconProps`
- **SoundIcon** — linha 149; função; exportada; parâmetros: `props: IconProps`
- **SettingsIcon** — linha 166; função; exportada; parâmetros: `props: IconProps`
- **OutlineIcon** — linha 182; função; exportada; parâmetros: `props: IconProps`
- **ChevronDown** — linha 195; função; exportada; parâmetros: `props: IconProps`
- **NewPageIcon** — linha 204; função; exportada; parâmetros: `props: IconProps`
- **SaveIcon** — linha 216; função; exportada; parâmetros: `props: IconProps`
- **PanelLeftIcon** — linha 228; função; exportada; parâmetros: `props: IconProps`
- **PanelRightIcon** — linha 243; função; exportada; parâmetros: `props: IconProps`
- **ReaderIcon** — linha 259; função; exportada; parâmetros: `props: IconProps`
- **FocusIcon** — linha 276; função; exportada; parâmetros: `props: IconProps`
- **MoreIcon** — linha 288; função; exportada; parâmetros: `props: IconProps`
- **CheckIcon** — linha 298; função; exportada; parâmetros: `props: IconProps`
- **ThemeIcon** — linha 307; função; exportada; parâmetros: `{ dark, ...props }: IconProps & { dark?: boolean }`
### `src/features/writing/components/writing-rail.tsx`

- **WritingRail** — linha 22; função; exportada; parâmetros: `{ displayName, avatarUrl, soundEnabled = false, soundTracks = [] }: { displayName: string; avatarUrl?: string; soundEnabled?: boolean; soundTracks?: SoundTrack[] }`
- **writingLink** — linha 36; arrow; interna; parâmetros: `view: string`
- **syncFromLocation** — linha 59; arrow; interna; parâmetros: `nenhum`
- **handleView** — linha 60; arrow; interna; parâmetros: `event: Event`
- **closeOnOutside** — linha 82; arrow; interna; parâmetros: `event: PointerEvent`
- **closeOnEscape** — linha 83; arrow; interna; parâmetros: `event: KeyboardEvent`
- **closeOnOutside** — linha 97; arrow; interna; parâmetros: `event: PointerEvent`
- **closeOnEscape** — linha 98; arrow; interna; parâmetros: `event: KeyboardEvent`
- **openSound** — linha 105; arrow; interna; parâmetros: `nenhum`
- **toggleTheme** — linha 110; função; interna; parâmetros: `nenhum`
- **handleArrowNavigation** — linha 118; função; interna; parâmetros: `event: React.KeyboardEvent<HTMLElement>`
- **handleWritingLink** — linha 127; função; interna; parâmetros: `event: React.MouseEvent<HTMLAnchorElement>, itemId: string, href?: string`
- **openTool** — linha 136; função; interna; parâmetros: `view: WritingView`
### `src/features/writing/components/writing-studio.tsx`

- **plainTextFromHtml** — linha 86; função; interna; parâmetros: `html: string`
- **countWords** — linha 96; função; interna; parâmetros: `html: string`
- **entityIdsFromHtml** — linha 101; função; interna; parâmetros: `html: string`
- **sanitizeEditorHtml** — linha 116; função; interna; parâmetros: `html: string`
- **isUuid** — linha 146; função; interna; parâmetros: `value: unknown`
- **safeEncyclopediaEntries** — linha 150; função; interna; parâmetros: `value: string | null`
- **safeProject** — linha 185; função; interna; parâmetros: `value: string | null, remoteProject: WritingProject`
- **htmlToMarkdown** — linha 238; função; interna; parâmetros: `document: WritingDocument`
- **ToolbarButton** — linha 253; função; interna; parâmetros: `{ label, shortcut, active = false, comfortable = false, onClick, children, }: { label: string; shortcut?: string; active?: boolean; comfortable?: boolean; onClick: (`
- **WritingCollection** — linha 310; função; interna; parâmetros: `{ view, documents, onCreate, onOpen, }: { view: Exclude<WritingView, 'editor' | 'encyclopedia' | 'relations'>; documents: WritingDocument[]; onCreate: (kind: WritingDocumentKind`
- **WritingStudio** — linha 363; função; exportada; parâmetros: `{ userId, initialProject, initialView, extensionAccess, initialMentionSettings, }: { userId: string; initialProject: WritingProject; initialView: WritingView; extensionAccess: typeof defaultExtensionRuntime; initialMenti`
- **syncFromLocation** — linha 411; arrow; interna; parâmetros: `nenhum`
- **handleView** — linha 415; arrow; interna; parâmetros: `event: Event`
- **measure** — linha 676; arrow; interna; parâmetros: `nenhum`
- **saveLocally** — linha 944; arrow; interna; parâmetros: `nenhum`
- **onKeyDown** — linha 1059; arrow; interna; parâmetros: `event: KeyboardEvent`
### `src/features/writing/server.ts`

- **mapDocument** — linha 10; função; interna; parâmetros: `row: Database['public']['Tables']['writing_documents']['Row']`
- **rolloutBucket** — linha 25; função; interna; parâmetros: `userId: string, flag: string`
- **loadExtensionRuntimeAccess** — linha 29; assíncrona função; exportada; parâmetros: `supabase: SupabaseClient<Database>, userId: string`
- **loadWritingProject** — linha 57; assíncrona função; exportada; parâmetros: `supabase: SupabaseClient<Database>, userId: string, requestedDocumentId?: string, requestedWorkId?: string,`
### `src/features/writing/spa-navigation.ts`

- **writingViewFromPathname** — linha 7; função; exportada; parâmetros: `pathname: string`
- **navigateWritingView** — linha 12; função; exportada; parâmetros: `view: WritingView, href: string, mode: 'push' | 'replace' = 'push'`
- **writingHref** — linha 18; função; exportada; parâmetros: `view: WritingView, workId: string, documentId?: string`
### `src/features/writing/types.ts`

- **parseProfileAnswers** — linha 53; função; exportada; parâmetros: `value: Json | undefined`
- **mapEncyclopediaEntry** — linha 63; função; exportada; parâmetros: `row: Database['public']['Tables']['encyclopedia_entries']['Row']`
- **isWritingView** — linha 113; função; exportada; parâmetros: `value: string`
### `src/features/writing/worldbuilding-schema.ts`

- **templatesForType** — linha 138; função; exportada; parâmetros: `type: EncyclopediaEntryType`
- **templateById** — linha 142; função; exportada; parâmetros: `id: string, fallbackType: EncyclopediaEntryType = 'character'`

## Autenticação

### `src/app/(auth)/forgot-password/page.tsx`

- **ForgotPasswordPage** — linha 12; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ error?: string }> }`
### `src/app/(auth)/login/page.tsx`

- **LoginPage** — linha 16; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ next?: string; status?: string }> }`
### `src/app/(auth)/register/check-email/page.tsx`

- **CheckEmailPage** — linha 10; assíncrona função; exportada; parâmetros: `{ searchParams, }: { searchParams: Promise<{ email?: string }>; }`
### `src/app/(auth)/register/page.tsx`

- **RegisterPage** — linha 12; assíncrona função; exportada; parâmetros: `{ searchParams, }: { searchParams: Promise<{ error?: string }>; }`
### `src/app/(auth)/update-password/page.tsx`

- **UpdatePasswordPage** — linha 12; assíncrona função; exportada; parâmetros: `nenhum`
### `src/features/auth/actions/login.ts`

- **login** — linha 9; assíncrona função; exportada; parâmetros: `_previousState: LoginState, formData: FormData,`
### `src/features/auth/actions/logout.ts`

- **logout** — linha 7; assíncrona função; exportada; parâmetros: `nenhum`
### `src/features/auth/actions/password.ts`

- **requestPasswordReset** — linha 14; assíncrona função; exportada; parâmetros: `_previousState: ForgotPasswordState, formData: FormData,`
- **updatePassword** — linha 57; assíncrona função; exportada; parâmetros: `_previousState: UpdatePasswordState, formData: FormData,`
### `src/features/auth/actions/register.ts`

- **register** — linha 9; assíncrona função; exportada; parâmetros: `_previousState: RegisterState, formData: FormData,`
### `src/features/auth/components/account-panel.tsx`

- **AccountContent** — linha 17; função; interna; parâmetros: `{ displayName, email, penName, writingFocus }: Omit<AccountPanelProps, 'mobile'>`
- **AccountPanel** — linha 48; função; exportada; parâmetros: `{ mobile = false, ...props }: AccountPanelProps`
### `src/features/auth/components/auth-brand.tsx`

- **AuthBrand** — linha 7; função; exportada; parâmetros: `nenhum`
### `src/features/auth/components/forgot-password-form.tsx`

- **SubmitButton** — linha 13; função; interna; parâmetros: `nenhum`
- **ForgotPasswordForm** — linha 22; função; exportada; parâmetros: `nenhum`
### `src/features/auth/components/legal-consent-drawer.tsx`

- **LegalConsentDrawer** — linha 47; função; exportada; parâmetros: `{ document }: { document: LegalDocumentKey }`
- **LegalDrawerContent** — linha 88; função; interna; parâmetros: `{ document, children, nested = false, }: { document: (typeof legalDocuments`
### `src/features/auth/components/login-context.tsx`

- **ContextContent** — linha 13; função; interna; parâmetros: `nenhum`
- **LoginContext** — linha 37; função; exportada; parâmetros: `{ mobile = false }: { mobile?: boolean }`
### `src/features/auth/components/login-form.tsx`

- **SubmitButton** — linha 15; função; interna; parâmetros: `nenhum`
- **LoginForm** — linha 27; função; exportada; parâmetros: `{ next }: { next?: string }`
### `src/features/auth/components/password-field.tsx`

- **PasswordField** — linha 17; função; exportada; parâmetros: `{ id, name = id, label, autoComplete, error, hint }: PasswordFieldProps`
### `src/features/auth/components/register-context.tsx`

- **RegisterContext** — linha 21; função; exportada; parâmetros: `{ mobile = false }: { mobile?: boolean }`
- **content** — linha 22; arrow; interna; parâmetros: `<div className="space-y-8"> <div> <p className="text-meta text-muted">Folha de abertura · 01</p> <h2 className="mt-4 max-w-sm font-serif text-3xl font-semibold leading-tight text-ink"> Um lugar para a história inteira fa`
### `src/features/auth/components/register-form.tsx`

- **SubmitButton** — linha 33; função; interna; parâmetros: `nenhum`
- **FieldMessage** — linha 42; função; interna; parâmetros: `{ message, id }: { message?: string; id: string }`
- **RegisterForm** — linha 46; função; exportada; parâmetros: `{ confirmationError = false }: { confirmationError?: boolean }`
- **validateCurrentStep** — linha 65; função; interna; parâmetros: `nenhum`
- **nextStep** — linha 86; função; interna; parâmetros: `nenhum`
- **previousStep** — linha 92; função; interna; parâmetros: `nenhum`
- **serverError** — linha 98; arrow; interna; parâmetros: `field: RegisterField`
- **errorFor** — linha 99; arrow; interna; parâmetros: `field: RegisterField`
- **PasswordRule** — linha 200; função; interna; parâmetros: `{ met, children }: { met: boolean; children: string }`
- **Consent** — linha 204; função; interna; parâmetros: `{ id, checked, onChange, children, required = false }: { id: string; checked: boolean; onChange: (checked: boolean`
- **Summary** — linha 213; função; interna; parâmetros: `{ label, value }: { label: string; value: string }`
### `src/features/auth/components/update-password-form.tsx`

- **SubmitButton** — linha 14; função; interna; parâmetros: `nenhum`
- **UpdatePasswordForm** — linha 23; função; exportada; parâmetros: `nenhum`
### `src/features/auth/redirects.ts`

- **getSafeAuthDestination** — linha 22; função; exportada; parâmetros: `value: string | null | undefined, fallback: string`
### `src/lib/supabase/admin.ts`

- **createAdminClient** — linha 8; função; exportada; parâmetros: `nenhum`
### `src/lib/supabase/client.ts`

- **createClient** — linha 6; função; exportada; parâmetros: `nenhum`
### `src/lib/supabase/proxy.ts`

- **refreshSession** — linha 7; assíncrona função; exportada; parâmetros: `request: NextRequest`
### `src/lib/supabase/server.ts`

- **createClient** — linha 7; assíncrona função; exportada; parâmetros: `nenhum`

## Banco e infraestrutura

### `src/proxy.ts`

- **proxy** — linha 6; assíncrona função; exportada; parâmetros: `request: NextRequest`

## Biblioteca

### `src/app/(workspace)/library/[view]/page.tsx`

- **LibraryViewPage** — linha 9; assíncrona função; exportada; parâmetros: `{ params, searchParams }: { params: Promise<{ view: string }>; searchParams: Promise<{ q?: string; sort?: string }> }`
### `src/app/(workspace)/library/catalogs/[catalogId]/page.tsx`

- **CatalogPage** — linha 7; assíncrona função; exportada; parâmetros: `{ params, searchParams }: { params: Promise<{ catalogId: string }>; searchParams: Promise<{ q?: string; sort?: string }> }`
### `src/app/(workspace)/library/catalogs/page.tsx`

- **CatalogsPage** — linha 7; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }`
### `src/app/(workspace)/library/page.tsx`

- **LibraryIndexPage** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/features/library/actions.ts`

- **value** — linha 12; função; interna; parâmetros: `formData: FormData, name: string, max: number`
- **safeReturnTo** — linha 16; função; interna; parâmetros: `formData: FormData`
- **authenticatedClient** — linha 21; assíncrona função; interna; parâmetros: `nenhum`
- **createWork** — linha 29; assíncrona função; exportada; parâmetros: `formData: FormData`
- **createCatalog** — linha 53; assíncrona função; exportada; parâmetros: `formData: FormData`
- **toggleFavorite** — linha 69; assíncrona função; exportada; parâmetros: `formData: FormData`
- **setWorkStatus** — linha 79; assíncrona função; exportada; parâmetros: `formData: FormData`
- **setArchived** — linha 89; assíncrona função; exportada; parâmetros: `formData: FormData`
- **setCatalogMembership** — linha 106; assíncrona função; exportada; parâmetros: `formData: FormData`
- **deleteCatalog** — linha 119; assíncrona função; exportada; parâmetros: `formData: FormData`
### `src/features/library/components/library-create-dialogs.tsx`

- **NewWorkDialog** — linha 14; função; exportada; parâmetros: `nenhum`
- **NewCatalogDialog** — linha 37; função; exportada; parâmetros: `nenhum`
### `src/features/library/components/library-page.tsx`

- **formatNumber** — linha 25; função; interna; parâmetros: `value: number`
- **formatDate** — linha 26; função; interna; parâmetros: `value: string`
- **HiddenActionFields** — linha 28; função; interna; parâmetros: `{ workId, returnTo }: { workId: string; returnTo: string }`
- **WorkActions** — linha 32; função; interna; parâmetros: `{ work, catalogs, returnTo }: { work: LibraryWork; catalogs: LibraryCatalog[]; returnTo: string }`
- **WorkCard** — linha 49; função; interna; parâmetros: `{ work, catalogs, returnTo }: { work: LibraryWork; catalogs: LibraryCatalog[]; returnTo: string }`
- **LibraryPage** — linha 74; função; exportada; parâmetros: `{ view, works, catalogs, stats, query = '', sort = 'updated', catalogId }: { view: LibraryView; works: LibraryWork[]; catalogs: LibraryCatalog[]; stats: { active: number; favorites: number; archived: number; words: numbe`
### `src/features/library/render-library.tsx`

- **renderLibrary** — linha 8; assíncrona função; exportada; parâmetros: `view: LibraryView, query: { q?: string; sort?: string }, catalogId?: string`
### `src/features/library/server.ts`

- **countWords** — linha 8; função; interna; parâmetros: `html: string`
- **loadLibrary** — linha 13; assíncrona função; exportada; parâmetros: `supabase: SupabaseClient<Database>, userId: string, view: LibraryView, options: { query?: string; sort?: string; catalogId?: string } = {},`
### `src/features/library/types.ts`

- **isLibraryView** — linha 35; função; exportada; parâmetros: `value: string`

## Conta e preferências

### `src/app/(workspace)/account/[section]/page.tsx`

- **AccountComingSoonPage** — linha 6; assíncrona função; exportada; parâmetros: `{ params }: { params: Promise<{ section: string }> }`
### `src/app/(workspace)/account/extensions/page.tsx`

- **rolloutBucket** — linha 15; função; interna; parâmetros: `userId: string, flag: string`
- **ExtensionsPage** — linha 19; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/(workspace)/account/layout.tsx`

- **AccountLayout** — linha 8; função; exportada; parâmetros: `{ children }: { children: React.ReactNode }`
### `src/app/(workspace)/account/loading.tsx`

- **AccountLoading** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/(workspace)/account/login/page.tsx`

- **AccountLoginPage** — linha 9; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ email?: string }> }`
### `src/app/(workspace)/account/page.tsx`

- **formatDate** — linha 8; função; interna; parâmetros: `value: string`
- **AccountOverviewPage** — linha 10; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/(workspace)/account/preferences/page.tsx`

- **AccountPreferencesPage** — linha 7; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ saved?: string; reset?: string }> }`
### `src/app/(workspace)/account/profile/page.tsx`

- **AccountProfilePage** — linha 10; assíncrona função; exportada; parâmetros: `{ searchParams }: AccountProfilePageProps`
### `src/features/account/actions/avatar.ts`

- **authenticatedClient** — linha 19; assíncrona função; interna; parâmetros: `nenhum`
- **uploadProfileAvatar** — linha 26; assíncrona função; exportada; parâmetros: `formData: FormData`
- **removeProfileAvatar** — linha 65; assíncrona função; exportada; parâmetros: `nenhum`
### `src/features/account/actions/update-login-email.ts`

- **updateLoginEmail** — linha 9; assíncrona função; exportada; parâmetros: `_previousState: LoginEmailState, formData: FormData`
### `src/features/account/actions/update-preferences.ts`

- **checked** — linha 9; função; interna; parâmetros: `formData: FormData, name: string`
- **numeric** — linha 11; função; interna; parâmetros: `formData: FormData, name: string, fallback: number, min: number, max: number`
- **updateAccountPreferences** — linha 13; assíncrona função; exportada; parâmetros: `formData: FormData`
- **resetAccountPreferences** — linha 35; assíncrona função; exportada; parâmetros: `nenhum`
### `src/features/account/actions/update-profile.ts`

- **getAuthenticatedProfileClient** — linha 14; assíncrona função; interna; parâmetros: `nenhum`
- **refreshProfile** — linha 22; função; interna; parâmetros: `savedSection: 'identity' | 'writing' | 'region'`
- **updateIdentityProfile** — linha 28; assíncrona função; exportada; parâmetros: `_previousState: AccountProfileState, formData: FormData`
- **updateWritingProfile** — linha 55; assíncrona função; exportada; parâmetros: `_previousState: AccountProfileState, formData: FormData`
- **updateRegionProfile** — linha 74; assíncrona função; exportada; parâmetros: `_previousState: AccountProfileState, formData: FormData`
### `src/features/account/components/account-navigation.tsx`

- **AccountNavigation** — linha 17; função; exportada; parâmetros: `nenhum`
### `src/features/account/components/avatar-editor.tsx`

- **clampPan** — linha 16; função; interna; parâmetros: `point: Point, size: ImageSize, zoom: number, viewportSize: number`
- **AvatarEditor** — linha 23; função; exportada; parâmetros: `{ initialUrl, initials }: { initialUrl?: string; initials: string }`
- **resetEditor** — linha 50; função; interna; parâmetros: `nenhum`
- **chooseFile** — linha 59; função; interna; parâmetros: `file?: File`
- **changeZoom** — linha 78; função; interna; parâmetros: `nextZoom: number`
- **handlePointerDown** — linha 84; função; interna; parâmetros: `event: React.PointerEvent<HTMLDivElement>`
- **handlePointerMove** — linha 90; função; interna; parâmetros: `event: React.PointerEvent<HTMLDivElement>`
- **handlePointerUp** — linha 99; função; interna; parâmetros: `event: React.PointerEvent<HTMLDivElement>`
- **saveCrop** — linha 104; assíncrona função; interna; parâmetros: `nenhum`
- **removeAvatar** — linha 145; assíncrona função; interna; parâmetros: `nenhum`
### `src/features/account/components/extensions-settings.tsx`

- **Toggle** — linha 14; função; interna; parâmetros: `{ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: (checked: boolean`
- **ExtensionsSettings** — linha 18; função; exportada; parâmetros: `nenhum`
- **updateSettings** — linha 30; função; interna; parâmetros: `changes: Partial<MentionExtensionSettings>`
### `src/features/account/components/login-email-settings.tsx`

- **SubmitButton** — linha 13; função; interna; parâmetros: `nenhum`
- **formatDate** — linha 18; função; interna; parâmetros: `value?: string`
- **LoginEmailSettings** — linha 23; função; exportada; parâmetros: `{ email, confirmedAt, lastSignInAt, provider, notice }: { email: string; confirmedAt?: string; lastSignInAt?: string; provider: string; notice?: 'requested' | 'confirmed' | 'error' }`
### `src/features/account/components/preference-hydrator.tsx`

- **PreferenceHydrator** — linha 9; função; exportada; parâmetros: `nenhum`
- **hydrate** — linha 13; assíncrona função; interna; parâmetros: `nenhum`
### `src/features/account/components/preferences-form.tsx`

- **SubmitButton** — linha 23; função; interna; parâmetros: `nenhum`
- **Switch** — linha 28; função; interna; parâmetros: `{ name, checked, onChange, title, description, required }: { name: string; checked: boolean; onChange: (checked: boolean`
- **SectionHeader** — linha 32; função; interna; parâmetros: `{ eyebrow, title, description }: { eyebrow: string; title: string; description: string }`
- **PreferencesForm** — linha 36; função; exportada; parâmetros: `{ initial, saved, reset }: { initial: AccountPreferences; saved?: boolean; reset?: boolean }`
- **applyAppearance** — linha 41; função; interna; parâmetros: `next: AccountPreferences['appearance']`
### `src/features/account/components/profile-form.tsx`

- **labelFor** — linha 40; função; interna; parâmetros: `options: ReadonlyArray<{ value: string; label: string }>, value: string`
- **FieldError** — linha 44; função; interna; parâmetros: `{ error, id }: { error?: string; id: string }`
- **FormError** — linha 48; função; interna; parâmetros: `{ state }: { state: AccountProfileState }`
- **DisplayField** — linha 52; função; interna; parâmetros: `{ label, value, wide = false }: { label: string; value?: string | number | null; wide?: boolean }`
- **EditButton** — linha 57; função; interna; parâmetros: `{ label, onClick }: { label: string; onClick: (`
- **FormActions** — linha 61; função; interna; parâmetros: `{ onDiscard }: { onDiscard: (`
- **SectionHeader** — linha 71; função; interna; parâmetros: `{ id, title, description, editing, onEdit }: { id: string; title: string; description: string; editing: boolean; onEdit: (`
- **IdentitySection** — linha 75; função; interna; parâmetros: `{ values }: { values: ProfileValues }`
- **WritingSection** — linha 109; função; interna; parâmetros: `{ values }: { values: ProfileValues }`
- **RegionSection** — linha 138; função; interna; parâmetros: `{ values }: { values: ProfileValues }`
- **ProfileForm** — linha 166; função; exportada; parâmetros: `{ values, saved, avatarUrl }: { values: ProfileValues; saved?: SavedSection; avatarUrl?: string }`
### `src/features/account/navigation.ts`

- **getAccountSection** — linha 17; função; exportada; parâmetros: `slug: string`
### `src/features/account/preferences.ts`

- **object** — linha 23; função; interna; parâmetros: `value: Json | null | undefined`
- **bool** — linha 27; função; interna; parâmetros: `value: Json | undefined, fallback: boolean`
- **number** — linha 29; função; interna; parâmetros: `value: Json | undefined, fallback: number, min: number, max: number`
- **parseAccountPreferences** — linha 31; função; exportada; parâmetros: `row?: Partial<Record<keyof AccountPreferences, Json>> | null`

## Extensões

### `src/features/extensions/catalog.ts`

- **parseExtensionRuntime** — linha 59; função; exportada; parâmetros: `value: string | null`
### `src/features/extensions/components/marketplace.tsx`

- **priceLabel** — linha 29; função; interna; parâmetros: `priceModel: string, priceCents: number, currency: string`
- **ManuscriptPreview** — linha 35; função; interna; parâmetros: `{ extensionId }: { extensionId: ExtensionId }`
- **MotionPreview** — linha 44; função; interna; parâmetros: `{ mediaType, mediaUrl, title }: { mediaType: string; mediaUrl: string; title: string }`
- **Marketplace** — linha 49; função; exportada; parâmetros: `{ controls, installationState, initialMentionSettings, catalogBacked = false }: { controls?: MarketplaceControl[]; installationState?: Partial<ExtensionRuntimeState>; initialMentionSettings?: MentionExtensionSettings; ca`
- **onKeyDown** — linha 86; arrow; interna; parâmetros: `event: KeyboardEvent`
- **openDetails** — linha 109; função; interna; parâmetros: `id: ExtensionId`
- **setInstalled** — linha 115; assíncrona função; interna; parâmetros: `id: ExtensionId, installed: boolean`
- **installFeaturedCollection** — linha 141; assíncrona função; interna; parâmetros: `nenhum`
- **updateMentionSettings** — linha 162; função; interna; parâmetros: `changes: Partial<typeof mentionSettings>`
- **actionLabel** — linha 169; função; interna; parâmetros: `id: ExtensionId`
### `src/features/extensions/entitlements.ts`

- **activeEntitlementIds** — linha 8; função; exportada; parâmetros: `rows: ExtensionEntitlementWindow[]`
### `src/features/extensions/mention-settings.ts`

- **parseMentionExtensionSettings** — linha 38; função; exportada; parâmetros: `value: string | null`

## Guias do produto

### `src/features/guidance/product-guidance.tsx`

- **routeMatches** — linha 19; função; interna; parâmetros: `pattern: string, pathname: string`
- **stableBucket** — linha 24; função; interna; parâmetros: `value: string`
- **intersects** — linha 30; função; interna; parâmetros: `required: string[], actual: string[]`
- **guideSettings** — linha 34; função; interna; parâmetros: `guide: Guide`
- **templateDocument** — linha 39; função; interna; parâmetros: `step: GuideStep`
- **cardPosition** — linha 47; função; interna; parâmetros: `rect: TargetRect | null, placement: string`
- **ProductGuidance** — linha 58; função; exportada; parâmetros: `nenhum`
- **load** — linha 73; assíncrona função; interna; parâmetros: `nenhum`
- **locate** — linha 121; arrow; interna; parâmetros: `nenhum`
- **update** — linha 135; arrow; interna; parâmetros: `nenhum`
- **goNext** — linha 163; arrow; interna; parâmetros: `nenhum`

## Interface compartilhada

### `src/components/ui/avatar.tsx`

- **Avatar** — linha 8; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>`
- **AvatarImage** — linha 12; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>`
- **AvatarFallback** — linha 16; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>`
- **AvatarBadge** — linha 20; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'span'>`
- **AvatarStatus** — linha 24; função; interna; parâmetros: `{ online = false }: { online?: boolean }`
- **AvatarGroup** — linha 28; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'div'>`
- **AvatarGroupCount** — linha 32; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'span'>`
### `src/components/ui/badge.tsx`

- **Badge** — linha 7; função; exportada; parâmetros: `{ className, ...props }: BadgeProps`
### `src/components/ui/breadcrumb.tsx`

- **Breadcrumb** — linha 6; função; interna; parâmetros: `props: React.ComponentProps<'nav'>`
- **BreadcrumbList** — linha 7; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'ol'>`
- **BreadcrumbItem** — linha 8; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'li'>`
- **BreadcrumbLink** — linha 9; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'a'>`
- **BreadcrumbPage** — linha 10; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'span'>`
- **BreadcrumbSeparator** — linha 11; função; interna; parâmetros: `{ children, className, ...props }: React.ComponentProps<'li'>`
- **BreadcrumbEllipsis** — linha 12; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'span'>`
### `src/components/ui/button.tsx`

- **Button** — linha 36; função; exportada; parâmetros: `{ className, variant, size, type = 'button', ...props }: ButtonProps`
### `src/components/ui/card.tsx`

- **Card** — linha 5; função; exportada; parâmetros: `{ className, ...props }: ComponentProps<'section'>`
- **CardHeader** — linha 14; função; exportada; parâmetros: `{ className, ...props }: ComponentProps<'div'>`
- **CardTitle** — linha 18; função; exportada; parâmetros: `{ className, ...props }: ComponentProps<'h2'>`
- **CardDescription** — linha 22; função; exportada; parâmetros: `{ className, ...props }: ComponentProps<'p'>`
- **CardContent** — linha 26; função; exportada; parâmetros: `{ className, ...props }: ComponentProps<'div'>`
### `src/components/ui/checkbox.tsx`

- **Checkbox** — linha 9; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>`
### `src/components/ui/command.tsx`

- **Command** — linha 10; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof CommandPrimitive>`
- **CommandDialog** — linha 14; função; interna; parâmetros: `{ title = 'Comandos', description = 'Busque uma página ou ação.', children, className, ...props }: React.ComponentProps<typeof Dialog> & { title?: string; description?: string; className?: string }`
- **CommandInput** — linha 23; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>`
- **CommandList** — linha 32; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>`
- **CommandEmpty** — linha 36; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>`
- **CommandGroup** — linha 40; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>`
- **CommandSeparator** — linha 44; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>`
- **CommandItem** — linha 48; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>`
- **CommandShortcut** — linha 52; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'span'>`
### `src/components/ui/dialog.tsx`

- **Dialog** — linha 10; função; interna; parâmetros: `props: React.ComponentProps<typeof DialogPrimitive.Root>`
- **DialogTrigger** — linha 14; função; interna; parâmetros: `props: React.ComponentProps<typeof DialogPrimitive.Trigger>`
- **DialogPortal** — linha 18; função; interna; parâmetros: `props: React.ComponentProps<typeof DialogPrimitive.Portal>`
- **DialogClose** — linha 22; função; interna; parâmetros: `props: React.ComponentProps<typeof DialogPrimitive.Close>`
- **DialogOverlay** — linha 26; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>`
- **DialogContent** — linha 35; função; interna; parâmetros: `{ className, children, showCloseButton = true, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }`
- **DialogHeader** — linha 56; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'div'>`
- **DialogFooter** — linha 60; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'div'>`
- **DialogTitle** — linha 64; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>`
- **DialogDescription** — linha 68; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>`
### `src/components/ui/drawer.tsx`

- **useDrawer** — linha 16; função; interna; parâmetros: `nenhum`
- **Drawer** — linha 26; função; interna; parâmetros: `{ modal = true, showSwipeHandle = false, snapPoints, swipeDirection = "down", ...props }: DrawerPrimitive.Root.Props & { showSwipeHandle?: boolean }`
- **DrawerTrigger** — linha 54; função; interna; parâmetros: `{ ...props }: DrawerPrimitive.Trigger.Props`
- **DrawerPortal** — linha 58; função; interna; parâmetros: `{ ...props }: DrawerPrimitive.Portal.Props`
- **DrawerClose** — linha 62; função; interna; parâmetros: `{ ...props }: DrawerPrimitive.Close.Props`
- **DrawerOverlay** — linha 66; função; interna; parâmetros: `{ className, ...props }: DrawerPrimitive.Backdrop.Props`
- **DrawerSwipeHandle** — linha 82; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<"div">`
- **DrawerContent** — linha 99; função; interna; parâmetros: `{ className, children, ...props }: DrawerPrimitive.Popup.Props`
- **DrawerHeader** — linha 166; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<"div">`
- **DrawerFooter** — linha 179; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<"div">`
- **DrawerTitle** — linha 189; função; interna; parâmetros: `{ className, ...props }: DrawerPrimitive.Title.Props`
- **DrawerDescription** — linha 202; função; interna; parâmetros: `{ className, ...props }: DrawerPrimitive.Description.Props`
### `src/components/ui/dropdown-menu.tsx`

- **DropdownMenuContent** — linha 16; função; interna; parâmetros: `{ className, sideOffset = 6, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>`
- **DropdownMenuItem** — linha 24; função; interna; parâmetros: `{ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }`
- **DropdownMenuLabel** — linha 28; função; interna; parâmetros: `{ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }`
- **DropdownMenuSeparator** — linha 32; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>`
- **DropdownMenuSubTrigger** — linha 36; função; interna; parâmetros: `{ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>`
- **DropdownMenuSubContent** — linha 40; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>`
- **DropdownMenuCheckboxItem** — linha 44; função; interna; parâmetros: `{ className, children, checked, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>`
- **DropdownMenuRadioItem** — linha 48; função; interna; parâmetros: `{ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>`
### `src/components/ui/input-group.tsx`

- **InputGroup** — linha 11; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<"div">`
- **InputGroupAddon** — linha 46; função; interna; parâmetros: `{ className, align = "inline-start", ...props }: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>`
- **InputGroupButton** — linha 86; função; interna; parâmetros: `{ className, type = "button", variant = "ghost", size = "xs", ...props }: Omit<React.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>`
- **InputGroupText** — linha 105; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<"span">`
- **InputGroupInput** — linha 117; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<"input">`
- **InputGroupTextarea** — linha 133; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<"textarea">`
### `src/components/ui/input.tsx`

- **Input** — linha 7; função; exportada; parâmetros: `{ className, type = 'text', ...props }: InputProps`
### `src/components/ui/label.tsx`

- **Label** — linha 7; função; exportada; parâmetros: `{ className, ...props }: LabelProps`
### `src/components/ui/menubar.tsx`

- **Menubar** — linha 8; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Root>`
- **MenubarMenu** — linha 24; função; interna; parâmetros: `{ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>`
- **MenubarGroup** — linha 30; função; interna; parâmetros: `{ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>`
- **MenubarPortal** — linha 36; função; interna; parâmetros: `{ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>`
- **MenubarRadioGroup** — linha 42; função; interna; parâmetros: `{ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>`
- **MenubarTrigger** — linha 50; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Trigger>`
- **MenubarContent** — linha 66; função; interna; parâmetros: `{ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }: React.ComponentProps<typeof MenubarPrimitive.Content>`
- **MenubarItem** — linha 87; função; interna; parâmetros: `{ className, inset, variant = "default", ...props }: React.ComponentProps<typeof MenubarPrimitive.Item> & { inset?: boolean variant?: "default" | "destructive" }`
- **MenubarCheckboxItem** — linha 110; função; interna; parâmetros: `{ className, children, checked, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & { inset?: boolean }`
- **MenubarRadioItem** — linha 141; função; interna; parâmetros: `{ className, children, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & { inset?: boolean }`
- **MenubarLabel** — linha 170; função; interna; parâmetros: `{ className, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }`
- **MenubarSeparator** — linha 190; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>`
- **MenubarShortcut** — linha 203; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<"span">`
- **MenubarSub** — linha 219; função; interna; parâmetros: `{ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>`
- **MenubarSubTrigger** — linha 225; função; interna; parâmetros: `{ className, inset, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }`
- **MenubarSubContent** — linha 249; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>`
### `src/components/ui/pending-submit-button.tsx`

- **PendingSubmitButton** — linha 8; função; exportada; parâmetros: `{ children, pendingLabel = 'Processando…', className, disabled, ...props }: React.ComponentProps<'button'> & { pendingLabel?: string }`
### `src/components/ui/select.tsx`

- **SelectTrigger** — linha 13; função; interna; parâmetros: `{ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>`
- **SelectContent** — linha 21; função; interna; parâmetros: `{ className, children, position = 'popper', ...props }: React.ComponentProps<typeof SelectPrimitive.Content>`
- **SelectLabel** — linha 33; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>`
- **SelectItem** — linha 37; função; interna; parâmetros: `{ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>`
- **SelectSeparator** — linha 46; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>`
### `src/components/ui/skeleton.tsx`

- **Skeleton** — linha 3; função; exportada; parâmetros: `{ className, ...props }: React.ComponentProps<'div'>`
- **PageSkeleton** — linha 7; função; exportada; parâmetros: `{ variant = 'workspace' }: { variant?: 'workspace' | 'writing' | 'admin' | 'legal' | 'root' }`
### `src/components/ui/step-flow.tsx`

- **StepFlow** — linha 27; função; exportada; parâmetros: `{ currentStep, totalSteps, title, description, direction = 'forward', children, className, }: StepFlowProps`
- **BookInsideCover** — linha 56; função; interna; parâmetros: `{ currentStep, totalSteps }: { currentStep: number; totalSteps: number }`
- **TurningSheet** — linha 139; função; interna; parâmetros: `{ content, direction, ariaHidden, onAnimationEnd, }: { content: StepContent; direction: Direction; ariaHidden: boolean; onAnimationEnd: (`
- **StepPage** — linha 165; função; interna; parâmetros: `{ content, ariaHidden = false }: { content: StepContent; ariaHidden?: boolean }`
### `src/components/ui/table.tsx`

- **Table** — linha 6; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'table'>`
- **TableHeader** — linha 7; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'thead'>`
- **TableBody** — linha 8; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'tbody'>`
- **TableFooter** — linha 9; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'tfoot'>`
- **TableRow** — linha 10; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'tr'>`
- **TableHead** — linha 11; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'th'>`
- **TableCell** — linha 12; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'td'>`
- **TableCaption** — linha 13; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<'caption'>`
### `src/components/ui/textarea.tsx`

- **Textarea** — linha 4; função; interna; parâmetros: `{ className, ...props }: React.ComponentProps<"textarea">`

## Legal

### `src/app/legal/[slug]/page.tsx`

- **generateStaticParams** — linha 17; função; exportada; parâmetros: `nenhum`
- **generateMetadata** — linha 21; assíncrona função; exportada; parâmetros: `{ params }: { params: Promise<{ slug: string }> }`
- **LegalDocumentPage** — linha 31; assíncrona função; exportada; parâmetros: `{ params }: { params: Promise<{ slug: string }> }`
### `src/app/legal/layout.tsx`

- **LegalLayout** — linha 4; assíncrona função; exportada; parâmetros: `{ children }: { children: React.ReactNode }`
### `src/app/legal/loading.tsx`

- **LegalLoading** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/legal/page.tsx`

- **LegalIndexPage** — linha 11; assíncrona função; exportada; parâmetros: `nenhum`
### `src/components/legal/AuthorCard.tsx`

- **AuthorCard** — linha 1; função; exportada; parâmetros: `{ department, updatedAtLabel, }: { department: string; updatedAtLabel: string; }`
### `src/components/legal/DownloadPdfButton.tsx`

- **DownloadPdfButton** — linha 1; função; exportada; parâmetros: `{ href, title }: { href: string; title: string }`
### `src/components/legal/LegalContactSection.tsx`

- **LegalContactSection** — linha 1; função; exportada; parâmetros: `nenhum`
### `src/components/legal/LegalSidebar.tsx`

- **LegalSidebar** — linha 6; função; exportada; parâmetros: `{ documents }: { documents: Array<{ slug: string; title: string }> }`
### `src/components/legal/RelatedFeatures.tsx`

- **RelatedFeatures** — linha 1; função; exportada; parâmetros: `{ features }: { features: string[] }`
### `src/components/legal/TableOfContents.tsx`

- **TableOfContents** — linha 3; função; exportada; parâmetros: `{ sections }: { sections: LegalSection[] }`
### `src/lib/legal/documents.ts`

- **getLegalDocument** — linha 512; função; exportada; parâmetros: `slug: string`
- **formatUpdatedAt** — linha 516; função; exportada; parâmetros: `iso: string`
- **slugifyHeading** — linha 521; função; exportada; parâmetros: `heading: string`
### `src/lib/legal/server.ts`

- **validSections** — linha 6; função; interna; parâmetros: `value: unknown`
- **mapDocument** — linha 14; função; interna; parâmetros: `row: { slug: string; title: string; short_description: string; department: string; effective_at: string; sections: unknown; related_features: string[]; pdf_href: string }`
- **loadLegalDocuments** — linha 19; assíncrona função; exportada; parâmetros: `nenhum`
- **loadLegalDocument** — linha 27; assíncrona função; exportada; parâmetros: `slug: string`

## OmniPublish e publicação

### `src/features/omnipublish/public-pages.tsx`

- **PublicCatalogPage** — linha 10; assíncrona função; exportada; parâmetros: `{ channel }: { channel: CommunicationChannel }`
- **PublicPublicationPage** — linha 16; assíncrona função; exportada; parâmetros: `{ channel, slug }: { channel: CommunicationChannel; slug: string }`
- **formatDate** — linha 30; função; interna; parâmetros: `value: string | null`
- **detailSections** — linha 35; função; interna; parâmetros: `fields: Record<string, string | boolean>`
### `src/features/omnipublish/publications.ts`

- **loadPublicCatalog** — linha 6; assíncrona função; exportada; parâmetros: `channel: CommunicationChannel`
- **loadPublicPublication** — linha 15; assíncrona função; exportada; parâmetros: `channel: CommunicationChannel, slugOrId: string`

## Outros

### `scaffold-legal-pages.js`

- **writeFile** — linha 27; função; interna; parâmetros: `relPath, content`
- **getLegalDocument** — linha 223; função; exportada; parâmetros: `slug: string`
- **formatUpdatedAt** — linha 227; função; exportada; parâmetros: `iso: string`
- **slugifyHeading** — linha 232; função; exportada; parâmetros: `heading: string`
- **LegalSidebar** — linha 254; função; exportada; parâmetros: `nenhum`
- **TableOfContents** — linha 296; função; exportada; parâmetros: `{ sections }: { sections: LegalSection[] }`
- **AuthorCard** — linha 324; função; exportada; parâmetros: `{ department, updatedAtLabel, }: { department: string; updatedAtLabel: string; }`
- **RelatedFeatures** — linha 353; função; exportada; parâmetros: `{ features }: { features: string[] }`
- **DownloadPdfButton** — linha 378; função; exportada; parâmetros: `{ href, title }: { href: string; title: string }`
- **LegalContactSection** — linha 395; função; exportada; parâmetros: `nenhum`
- **LegalLayout** — linha 424; função; exportada; parâmetros: `{ children }: { children: React.ReactNode }`
- **LegalIndexPage** — linha 455; função; exportada; parâmetros: `nenhum`
- **generateStaticParams** — linha 496; função; exportada; parâmetros: `nenhum`
- **generateMetadata** — linha 500; função; exportada; parâmetros: `{ params }: { params: { slug: string } }`
- **LegalDocumentPage** — linha 509; função; exportada; parâmetros: `{ params }: { params: { slug: string } }`
### `src/app/(onboarding)/onboarding/page.tsx`

- **OnboardingPage** — linha 10; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/(workspace)/dashboard/page.tsx`

- **QuickAction** — linha 35; função; interna; parâmetros: `{ label, description, icon: Icon }: (typeof quickActions`
- **DashboardPage** — linha 54; assíncrona função; exportada; parâmetros: `{ searchParams }: { searchParams: Promise<{ status?: string }> }`
### `src/app/(workspace)/layout.tsx`

- **WorkspaceLayout** — linha 8; assíncrona função; exportada; parâmetros: `{ children }: { children: React.ReactNode }`
### `src/app/(workspace)/loading.tsx`

- **WorkspaceLoading** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/(workspace)/sound/page.tsx`

- **LegacySoundPage** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/ajuda/[slug]/page.tsx`

- **KnowledgeArticlePage** — linha 2; assíncrona função; exportada; parâmetros: `{ params }: { params: Promise<{ slug: string }> }`
### `src/app/ajuda/page.tsx`

- **KnowledgePage** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/auth/callback/route.ts`

- **GET** — linha 7; assíncrona função; exportada; parâmetros: `request: Request`
### `src/app/blog/[slug]/page.tsx`

- **BlogArticlePage** — linha 2; assíncrona função; exportada; parâmetros: `{ params }: { params: Promise<{ slug: string }> }`
### `src/app/blog/page.tsx`

- **BlogPage** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/comunicados/[slug]/page.tsx`

- **AnnouncementPage** — linha 2; assíncrona função; exportada; parâmetros: `{ params }: { params: Promise<{ slug: string }> }`
### `src/app/comunicados/page.tsx`

- **AnnouncementsPage** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/layout.tsx`

- **RootLayout** — linha 24; função; exportada; parâmetros: `{ children }: Readonly<{ children: React.ReactNode }>`
### `src/app/loading.tsx`

- **RootLoading** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/newsletters/[slug]/page.tsx`

- **NewsletterPage** — linha 2; assíncrona função; exportada; parâmetros: `{ params }: { params: Promise<{ slug: string }> }`
### `src/app/newsletters/page.tsx`

- **NewslettersPage** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/page.tsx`

- **Home** — linha 9; função; exportada; parâmetros: `nenhum`
### `src/app/publicacoes/page.tsx`

- **PublicationsHubPage** — linha 8; assíncrona função; exportada; parâmetros: `nenhum`
### `src/app/status/[slug]/page.tsx`

- **IncidentPage** — linha 2; assíncrona função; exportada; parâmetros: `{ params }: { params: Promise<{ slug: string }> }`
### `src/app/status/page.tsx`

- **StatusPage** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/app/updates/[id]/page.tsx`

- **UpdatePage** — linha 3; assíncrona função; exportada; parâmetros: `{ params }: { params: Promise<{ id: string }> }`
### `src/app/updates/page.tsx`

- **UpdatesPage** — linha 4; função; exportada; parâmetros: `nenhum`
### `src/components/navigation-progress.tsx`

- **NavigationProgress** — linha 6; função; exportada; parâmetros: `nenhum`
- **begin** — linha 22; função; interna; parâmetros: `nenhum`
- **finish** — linha 28; função; interna; parâmetros: `nenhum`
- **onClick** — linha 32; função; interna; parâmetros: `event: MouseEvent`
### `src/config/env.ts`

- **getSupabaseEnv** — linha 14; função; exportada; parâmetros: `nenhum`
- **getSiteUrl** — linha 42; função; exportada; parâmetros: `nenhum`
### `src/features/onboarding/actions/complete-profile.ts`

- **completeProfile** — linha 11; assíncrona função; exportada; parâmetros: `_previousState: OnboardingState, formData: FormData,`
### `src/features/onboarding/components/profile-form.tsx`

- **SubmitButton** — linha 19; função; interna; parâmetros: `nenhum`
- **ProfileForm** — linha 28; função; exportada; parâmetros: `{ defaultPenName = '', defaultWritingFocus = '', defaultExperienceLevel = '' }: ProfileFormProps`
- **nextStep** — linha 37; função; interna; parâmetros: `nenhum`
- **previousStep** — linha 51; função; interna; parâmetros: `nenhum`
### `src/features/workspace/components/operational-tag.tsx`

- **OperationalTagBadge** — linha 6; função; exportada; parâmetros: `{ tag, compact = false }: { tag: OperationalTag; compact?: boolean }`
### `src/features/workspace/components/workspace-header.tsx`

- **initials** — linha 39; função; interna; parâmetros: `name: string`
- **ResponsiveBreadcrumb** — linha 43; função; interna; parâmetros: `nenhum`
- **WorkspaceAvatarGroup** — linha 71; função; exportada; parâmetros: `{ names }: { names: string[] }`
- **WorkspaceHeader** — linha 82; função; exportada; parâmetros: `{ displayName, email, penName, avatarUrl, showWorkspaceMenu = true }: WorkspaceHeaderProps`
### `src/features/workspace/components/workspace-shell.tsx`

- **WorkspaceShell** — linha 24; função; exportada; parâmetros: `{ children, profile, soundEnabled = false, soundTracks = [] }: WorkspaceShellProps`
### `src/features/workspace/components/workspace-sidebar.tsx`

- **ContextSelector** — linha 16; função; interna; parâmetros: `{ collapsed = false }: { collapsed?: boolean }`
- **WorkItem** — linha 35; função; interna; parâmetros: `{ item, collapsed = false }: { item: (typeof workNavigation`
- **withCurrentWork** — linha 41; arrow; interna; parâmetros: `href: string`
- **SidebarContent** — linha 96; função; interna; parâmetros: `{ mobile = false, collapsed = false, onCollapsedChange }: { mobile?: boolean; collapsed?: boolean; onCollapsedChange?: (collapsed: boolean`
- **WorkspaceSidebar** — linha 132; função; exportada; parâmetros: `{ mobile = false, collapsed = false, onCollapsedChange }: { mobile?: boolean; collapsed?: boolean; onCollapsedChange?: (collapsed: boolean`
### `src/lib/cn.ts`

- **cn** — linha 4; função; exportada; parâmetros: `...inputs: ClassValue[]`

## Som e mídia

### `src/features/sound/components/audio-review-drawer.tsx`

- **clock** — linha 16; função; interna; parâmetros: `ms: number`
- **AudioReviewDrawer** — linha 18; função; exportada; parâmetros: `{ track, onClose }: { track: SoundTrack | null; onClose: (`
- **toggle** — linha 33; assíncrona função; interna; parâmetros: `nenhum`
- **addMarker** — linha 38; assíncrona função; interna; parâmetros: `nenhum`
### `src/features/sound/components/sound-binder-footer.tsx`

- **SoundBinderFooter** — linha 6; função; exportada; parâmetros: `nenhum`
- **openSound** — linha 9; arrow; interna; parâmetros: `nenhum`
### `src/features/sound/components/sound-dock.tsx`

- **time** — linha 8; função; interna; parâmetros: `value: number`
- **SoundDock** — linha 14; função; exportada; parâmetros: `{ enabled }: { enabled: boolean }`
### `src/features/sound/components/sound-mega-menu.tsx`

- **channelIcon** — linha 21; função; interna; parâmetros: `id: MixerChannelId`
- **formatDuration** — linha 22; função; interna; parâmetros: `seconds: number`
- **SoundMegaMenu** — linha 24; função; exportada; parâmetros: `{ open, onClose, tracks }: { open: boolean; onClose: (`
- **close** — linha 35; arrow; interna; parâmetros: `event: KeyboardEvent`
- **applyPreset** — linha 38; assíncrona função; interna; parâmetros: `preset: SoundPreset`
- **handleTrack** — linha 39; assíncrona função; interna; parâmetros: `track: SoundTrack`
### `src/features/sound/components/sound-playlists-panel.tsx`

- **SoundPlaylistsPanel** — linha 19; função; exportada; parâmetros: `{ tracks }: { tracks: SoundTrack[] }`
- **createPlaylist** — linha 44; assíncrona função; interna; parâmetros: `nenhum`
- **addPreset** — linha 51; assíncrona função; interna; parâmetros: `preset: SoundPreset`
- **addTrack** — linha 59; assíncrona função; interna; parâmetros: `track: SoundTrack`
- **removeItem** — linha 66; assíncrona função; interna; parâmetros: `id: string`
- **deletePlaylist** — linha 67; assíncrona função; interna; parâmetros: `id: string`
- **playPreset** — linha 68; assíncrona função; interna; parâmetros: `preset: SoundPreset`
### `src/features/sound/components/sound-pomodoro-panel.tsx`

- **clock** — linha 7; função; interna; parâmetros: `seconds: number`
- **SoundPomodoroPanel** — linha 9; função; exportada; parâmetros: `nenhum`
### `src/features/sound/components/sound-settings-panel.tsx`

- **SoundSettingsPanel** — linha 12; função; exportada; parâmetros: `nenhum`
- **saveSettings** — linha 44; assíncrona função; interna; parâmetros: `nenhum`
- **saveMix** — linha 51; assíncrona função; interna; parâmetros: `nenhum`
- **applyMix** — linha 57; função; interna; parâmetros: `mix: MixRow`
- **deleteMix** — linha 68; assíncrona função; interna; parâmetros: `id: string`
### `src/features/sound/server.ts`

- **loadSoundLibrary** — linha 8; assíncrona função; exportada; parâmetros: `supabase: SupabaseClient<Database>`
### `src/features/sound/sound-provider.tsx`

- **SoundProvider** — linha 63; função; exportada; parâmetros: `{ children }: { children: React.ReactNode }`
- **registerTyping** — linha 193; arrow; interna; parâmetros: `event: KeyboardEvent`
- **click** — linha 248; assíncrona arrow; interna; parâmetros: `event: KeyboardEvent`
- **useSound** — linha 303; função; exportada; parâmetros: `nenhum`

## Visão geral

### `src/app/(workspace)/overview/[view]/page.tsx`

- **OverviewViewPage** — linha 9; assíncrona função; exportada; parâmetros: `{ params, searchParams }: { params: Promise<{ view: string }>; searchParams: Promise<{ work?: string }> }`
### `src/app/(workspace)/overview/page.tsx`

- **OverviewIndexPage** — linha 3; função; exportada; parâmetros: `nenhum`
### `src/features/overview/actions.ts`

- **text** — linha 10; função; interna; parâmetros: `formData: FormData, key: string, max = 120`
- **returnTo** — linha 11; função; interna; parâmetros: `workId: string`
- **auth** — linha 13; assíncrona função; interna; parâmetros: `nenhum`
- **createWritingGoal** — linha 21; assíncrona função; exportada; parâmetros: `formData: FormData`
- **toggleWritingGoal** — linha 35; assíncrona função; exportada; parâmetros: `formData: FormData`
- **deleteWritingGoal** — linha 45; assíncrona função; exportada; parâmetros: `formData: FormData`
### `src/features/overview/components/new-goal-dialog.tsx`

- **NewGoalDialog** — linha 9; função; exportada; parâmetros: `{ workId }: { workId: string }`
### `src/features/overview/components/overview-page.tsx`

- **number** — linha 18; função; interna; parâmetros: `value: number`
- **date** — linha 19; função; interna; parâmetros: `value: string`
- **relativeDate** — linha 20; função; interna; parâmetros: `value: string`
- **WorkSelector** — linha 28; função; interna; parâmetros: `{ works, selectedWork, view }: { works: OverviewWork[]; selectedWork: OverviewWork; view: OverviewView }`
- **Metric** — linha 32; função; interna; parâmetros: `{ icon: Icon, value, label }: { icon: typeof BookOpen; value: string; label: string }`
- **RecentDocuments** — linha 36; função; interna; parâmetros: `{ documents, workId }: { documents: OverviewDocument[]; workId: string }`
- **GoalCard** — linha 40; função; interna; parâmetros: `{ goal, workId }: { goal: OverviewGoal; workId: string }`
- **OverviewPage** — linha 50; função; exportada; parâmetros: `{ view, works, selectedWork, documents, goals, metrics }: { view: OverviewView; works: OverviewWork[]; selectedWork: OverviewWork | null; documents: OverviewDocument[]; goals: OverviewGoal[]; metrics: { words: number; ch`
### `src/features/overview/render-overview.tsx`

- **renderOverview** — linha 8; assíncrona função; exportada; parâmetros: `view: OverviewView, workId?: string`
### `src/features/overview/server.ts`

- **countWords** — linha 8; função; interna; parâmetros: `html: string`
- **loadOverview** — linha 13; assíncrona função; exportada; parâmetros: `supabase: SupabaseClient<Database>, userId: string, requestedWorkId?: string`
### `src/features/overview/types.ts`

- **isOverviewView** — linha 38; função; exportada; parâmetros: `value: string`
