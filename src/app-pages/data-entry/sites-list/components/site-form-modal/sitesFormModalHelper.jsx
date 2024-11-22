export const sampleUnitTypeProject1 = [
  { value: 'B', text: 'B - Bend' },
  { value: 'S', text: 'S - Segment' },
];

export const sitesFormTooltipContent = {
  sampleUnit: (
    <>
      <p className='margin-bottom-0'>
        Must select <span className='text-bold'>Segment</span> and{' '}
        <span className='text-bold'>Sample Unit Type</span> to see Sample Unit
        options.
      </p>
      <p>Two ways to select option:</p>
      <ol>
        <li>Click on input box and select option from dropdown, or </li>
        <li>Search for option by typing in the box.</li>
      </ol>
      <p className='margin-bottom-0'>
        Click the 'x' button to clear the input field.
      </p>
    </>
  ),
  sampleUnitType: (
    <>
      <p className='margin-bottom-0'>
        Must select <span className='text-bold'>Project</span> to see Sample
        Unit Type options.
      </p>
    </>
  ),
  season: (
    <p className='margin-bottom-0'>
      Must select <span className='text-bold'>Project</span> to see Season
      options.
    </p>
  ),
  segment: (
    <>
      <p className='margin-bottom-0'>
        Must select <span className='text-bold'>Field Office</span> and{' '}
        <span className='text-bold'>Project</span> to see Segment options.
      </p>
      <p>Two ways to select option:</p>
      <ol>
        <li>Click on input box and select option from dropdown, or </li>
        <li>Search for option by typing in the box.</li>
      </ol>
      <p className='margin-bottom-0'>
        Click the 'x' button to clear the input field.
      </p>
    </>
  ),
};
