// src/components/DicomViewer/cornerstone/initTools.ts
import {
    ToolGroupManager,
    Enums,
    WindowLevelTool,
    PanTool,
    ZoomTool,
    StackScrollTool,
  } from '@cornerstonejs/tools';
  
const initTools = () => {
    const { MouseBindings } = Enums;
    const toolGroupId = 'DEFAULT_TOOL_GROUP';

    // 도구 그룹 생성
    const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

    // 도구 추가
    toolGroup?.addTool(WindowLevelTool.toolName);
    toolGroup?.addTool(PanTool.toolName);
    toolGroup?.addTool(ZoomTool.toolName);
    toolGroup?.addTool(StackScrollTool.toolName);

    // 기본 도구 설정
    toolGroup?.setToolActive(WindowLevelTool.toolName, {
        bindings: [{ mouseButton: MouseBindings.Primary }],
    });
    toolGroup?.setToolActive(PanTool.toolName, {
        bindings: [{ mouseButton: MouseBindings.Secondary }],
    });
    toolGroup?.setToolActive(ZoomTool.toolName, {
        bindings: [{ mouseButton: MouseBindings.Auxiliary }],
    });
    toolGroup?.setToolActive(StackScrollTool.toolName, {
        bindings: [{ mouseButton: MouseBindings.Primary }],
    });

    return toolGroupId;
};

export default initTools;
